const router = require('koa-router')()
const Project = require('../serves/database/models/Project')
const ProjectLog = require('../serves/database/models/ProjectLog')
const ObjectUtil = require('../utils/objectUtil')
const GitUtil = require('../utils/gitUtil')

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
  ctx.body = await Project.findById(id)
})

/**
 * 获取项目时间轴
 */
router.get('/timeline', async (ctx, next) => {
  const { id } = ctx.query
  ctx.body = await ProjectLog.find({ projectId: id }).sort({ unix: -1 })
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
  ctx.body = await Project.initProject(id)

  ProjectLog.create({
    projectId: id,
    title: '初始化项目',
    unix: new Date().getTime()
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
    title: '删除项目',
    unix: new Date().getTime()
  })
})

module.exports = router
