const BaseSchema = require('./BaseSchema')
const mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId
const { renameId } = require('../../../utils/objectUtil')

const ProjectLogSchema = new BaseSchema({
  // 项目 id
  projectId: { type: ObjectId, ref: 'Project' },
  // 操作用户 id
  userId: { type: ObjectId, ref: 'User' },
  // 标题
  title: String,
  // 时间戳
  unix: Number,
  // 日志
  log: String
})

Object.assign(ProjectLogSchema.statics, {
  findLogListById: async function(id) {
    const logList = await this.findById(id)
    logList.forEach(item => {
      if (item.userId) {
      }
    })
    const logList = await this.aggregate()
      .addFields({ id: '$_id' })
      .lookup({
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      })
      .project({
        _id: 0,
        user: { password: 0, salt: 0 }
      })
      .match({ projectId: new ObjectId(id) })
      .sort({ unix: -1 })
    return renameId(logList)
  }
})

module.exports = mongoose.model('ProjectLog', ProjectLogSchema)
