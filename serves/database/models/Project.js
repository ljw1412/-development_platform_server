const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')
const GitUtil = require('../../../utils/gitUtil')

const PROJECT_STATE_NOT_INIT = 0
const PROJECT_STATE_INITING = 1
const PROJECT_STATE_INITED = 2
const PROJECT_STATE_ERROR = 3

const ProjectSchema = new BaseSchema({
  // 项目名称
  name: String,
  // 项目来源  (可选: git custom)
  origin: String,
  // git 仓库地址
  git: String,
  // 服务器上的项目路径
  path: String,
  // 项目描述
  description: String,
  // 项目状况
  state: Number
})

Object.assign(ProjectSchema.statics, {
  // 新增或修改项目
  insertOrUpdateProject: async function(project) {
    if (project.id) {
      // 修改
      await this.findByIdAndUpdate(project.id, project)
      return { message: 'rename successful.', id: project.id }
    } else {
      // 插入
      project.state = PROJECT_STATE_NOT_INIT
      return await this.create(project)
    }
  },
  // 初始化项目
  initProject: async function(id) {
    const project = await this.findById(id)
    if (!project) return { error: 'Not found project.' }
    if (project.state !== 0) return { error: 'The project has been inited.' }
    project.state = PROJECT_STATE_INITING
    await project.save()
    const result = global.config.ENABLE_GIT_CLONE
      ? await GitUtil.cloneRepository(project.path, project.git)
      : { message: '"git clone" is forbidden.' }
    project.state = result.error ? PROJECT_STATE_NOT_INIT : PROJECT_STATE_INITED
    await project.save()
    return result
  },
  // 查询项目
  findProjectById: async function(id) {
    let project = await this.findById(id)
    if (!project) return { error: 'Not found project.' }
    project = project.toObject()
    if (project.origin === 'git') {
      project.status = await GitUtil.statusRepository(project.path)
    }
    return project
  },
  // 删除项目
  deleteProject: async function(id, isDeletePath = false) {
    const project = await this.findById(id)
    if (!project) return { error: 'Not found project.' }
    if (project.path) {
      let message = `Successful deletion of ${project.name}.`
      // if (isDeletePath) {
      //   const deleteResult = await FileUtil.removeDir(project.path)
      //   if (deleteResult.error) message += deleteResult.error
      // }
      await project.remove()
      return { message }
    }
  }
})

module.exports = mongoose.model('Project', ProjectSchema)
