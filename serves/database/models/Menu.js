const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const MenuSchema = new Schema(
  {
    icon: String,
    image: String,
    title: String,
    route: { path: String, name: String },
    children: []
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
    const setting = require('../default/menu.json')
    setting.map(item => {
      if (item.children && item.children.length) {
        item.children = item.children.map(el => this(el))
      }
      return item
    })
    const data = await this.create(setting)
    console.log('[完成]', '菜单初始化', '\n', data)
  }
}

/**
 * 重新生成默认的菜单栏(用于菜单栏的更新)
 */
const reset = async function() {
  await this.remove({})
  await this.initData()
}

Object.assign(MenuSchema.statics, { initData, reset })

module.exports = mongoose.model('Menu', MenuSchema)
