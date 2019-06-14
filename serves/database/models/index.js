const mongoose = require('mongoose')
const UserSchema = require('./User')
mongoose.model('User', UserSchema)
