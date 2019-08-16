const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId

const ProjectLogSchema = new BaseSchema({
  // 项目 id
  projectId: { type: ObjectId, ref: 'Project' },
  // 标题
  title: String,
  // 时间戳
  unix: Number,
  // 日志
  log: String
})

Object.assign(ProjectLogSchema.statics, {})

module.exports = mongoose.model('ProjectLog', ProjectLogSchema)
