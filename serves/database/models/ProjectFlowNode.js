const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId

const ProjectFlowNodeSchema = new BaseSchema({
  // 项目流程 id
  projectFlowId: { type: ObjectId, ref: 'ProjectFlow' },
  // 节点名称
  name: String,
  parent: { type: ObjectId, ref: 'ProjectFlowNode' },
  children: []
})

module.exports = mongoose.model('ProjectFlowNode', ProjectFlowNodeSchema)
