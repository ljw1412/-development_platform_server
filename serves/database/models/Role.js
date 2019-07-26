const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const RoleSchema = new Schema(
  {
    name: String,
    tag: String,
    isHide: Boolean,
    isRequired: Boolean,
    menuList: []
  },
  {
    versionKey: false,
    toObject: {
      getters: true,
      transform: function(doc, ret, options) {
        delete ret._id
        return ret
      }
    },
    toJSON: {
      getters: true,
      transform: function(doc, ret, options) {
        delete ret._id
        return ret
      }
    }
  }
)

const initData = async function() {
  const count = await this.countDocuments({})
  if (!count) {
    const role = require('../default/role.json')
    const data = await this.create(role)
    console.log('[完成]', '权限初始化', '\n', data)
  }
}

Object.assign(RoleSchema.statics, { initData })

module.exports = mongoose.model('Role', RoleSchema)
