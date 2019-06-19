const mongoose = require('mongoose')
const config = require('../../config')

mongoose.Promise = global.Promise

mongoose.connect(`${config.MONGODB_HOST}/dev_platform`, {
  useNewUrlParser: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('mongodb opened.')
})

require('./models/User')
require('./models/Menu')
