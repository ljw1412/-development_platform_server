const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId
const moment = require('moment')

const ProjectFlowSchema = new BaseSchema({
  // 项目 id
  projectId: { type: ObjectId, ref: 'Project' },
  // 发布流程名称
  name: String,
  // 节点数
  nodeCount: Number,
  // 创建日期
  createDateTime: {
    type: String,
    default: moment().format('YYYY-MM-DD HH:mm:ss')
  },
  // 流程排序权重
  order: Number
})

module.exports = mongoose.model('ProjectFlow', ProjectFlowSchema)
