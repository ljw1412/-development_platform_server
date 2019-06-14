const mongoose = require('mongoose')

module.exports = {
  // 获取模型
  getModel: modelName => {
    return mongoose.model(modelName)
  }
}
