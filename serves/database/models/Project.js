const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose')

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

ProjectSchema.statics.insertOrUpdateProject = async function(project) {
  if (project.id) {
    // 修改
  } else {
    // 插入
    project.state = PROJECT_STATE_NOT_INIT
    return await this.create(project)
  }
}

module.exports = mongoose.model('Project', ProjectSchema)
