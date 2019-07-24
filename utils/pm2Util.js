const pm2 = require('pm2')

module.exports.list = () =>
  new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) reject(err)
      return resolve(list)
    })
  })
