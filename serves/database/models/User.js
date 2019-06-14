const mongoose = require('mongoose'),
  Schema = mongoose.Schema

module.exports = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
})
