const router = require('koa-router')()
const User = require('../serves/database/models/User')
const Project = require('../serves/database/models/Project')
const ProjectLog = require('../serves/database/models/ProjectLog')
const ProjectFlow = require('../serves/database/models/ProjectFlow')
const ObjectUtil = require('../utils/objectUtil')
const GitUtil = require('../utils/gitUtil')
const git = require('simple-git/promise')

router.prefix('/project')

/**
 * 校验 git 地址有效性
 */
router.get('/checkGitValid', async ctx => {
  const { url } = ctx.query
  ctx.body = await GitUtil.isVaildRepository(url)
})

/**
 * 获取项目列表
 */
router.get('/list', async (ctx, next) => {
  ctx.body = await Project.find()
})

/**
 * 获取项目详情
 */
router.get('/details', async (ctx, next) => {
  const { id } = ctx.query
  ctx.body = await Project.findProjectById(id)
})

/**
 * 获取项目时间轴
 */
router.get('/timeline', async (ctx, next) => {
  const { id } = ctx.query
  logList = await ProjectLog.find({ projectId: id }).sort({ unix: -1 })

  logList = await Promise.all(
    logList.map(async item => {
      if (item.userId) {
        item = item.toObject()
        item.user = await User.findById(item.userId, {
          email: 1,
          username: 1,
          nickname: 1
        })
      }
      return item
    })
  )
  ctx.body = logList
})

/**
 * 保存或修改项目
 */
router.post('/save', async ctx => {
  const project = ObjectUtil.only(
    ctx.request.body,
    'id name origin git path description'
  )
  const result = await Project.insertOrUpdateProject(project)

  ProjectLog.create({
    projectId: project.id || result.id,
    userId: (ctx.currentUser && ctx.currentUser.id) || '',
    title: project.id ? '项目属性更新' : '创建项目',
    unix: new Date().getTime(),
    log: JSON.stringify(project)
  })

  ctx.body = result
})

/**
 * 初始化项目 (git clone)
 */
router.post('/init', async ctx => {
  const { id } = ctx.request.body
  const result = await Project.initProject(id)
  ctx.body = result

  ProjectLog.create({
    projectId: id,
    userId: (ctx.currentUser && ctx.currentUser.id) || '',
    title: `初始化项目(${result.error ? '失败' : '成功'})`,
    unix: new Date().getTime(),
    log: result.error ? result.error.stack : result
  })
})

/**
 * 删除项目
 */
router.post('/delete', async ctx => {
  let { id, isDeletePath } = ctx.request.body
  isDeletePath = isDeletePath === 'true'
  ctx.body = await Project.deleteProject(id, isDeletePath)

  ProjectLog.create({
    projectId: id,
    userId: (ctx.currentUser && ctx.currentUser.id) || '',
    title: '删除项目',
    unix: new Date().getTime()
  })
})

router.get('/flow/list', async ctx => {
  const { projectId } = ctx.query
  ctx.body = await ProjectFlow.find({ projectId })
})

/**
 * 创建项目流程
 */
router.post('/flow/create', async ctx => {
  let { projectId, name } = ctx.request.body
  ctx.body = await ProjectFlow.create({
    projectId,
    name,
    order: 100,
    nodeCount: 0
  })
})

module.exports = router
