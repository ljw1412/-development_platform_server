const mongoose = require('mongoose'),
  Schema = mongoose.Schema

const baseOptions = {
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

module.exports = class BaseSchema extends Schema {
  constructor(definition, options) {
    options = Object.assign({}, baseOptions, options)
    super(definition, options)
  }
}
