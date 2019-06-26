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
  { versionKey: false }
)

const init = async function() {
  const count = await this.countDocuments({})
  if (!count) {
    const setting = require('../default/menu.json')
    setting.map(item => {
      if (item.children && item.children.length) {
        item.children = item.children.map(el => new Menu(el))
      }
      return item
    })
    const data = await this.create(setting)
  }
}

/**
 * 重新生成默认的菜单栏(用于菜单栏的更新)
 */
const reset = async function() {
  await this.remove({})
  await this.init()
}

Object.assign(MenuSchema.statics, { init, reset })
const Menu = mongoose.model('Menu', MenuSchema)
