const pm2 = require('pm2')

const callback = (resolve, reject) => (err, data) => {
  if (err) reject(err)
  return resolve(data)
}

module.exports.list = () =>
  new Promise((resolve, reject) => {
    pm2.list(callback(resolve, reject))
  })

module.exports.describe = process =>
  new Promise((resolve, reject) => {
    pm2.describe(process, callback(resolve, reject))
  })

module.exports.start = options =>
  new Promise((resolve, reject) => {
    pm2.start(options, callback(resolve, reject))
  })

module.exports.start = (script, options) =>
  new Promise((resolve, reject) => {
    pm2.start(script, options, callback(resolve, reject))
  })

module.exports.stop = process =>
  new Promise((resolve, reject) => {
    pm2.stop(process, callback(resolve, reject))
  })

module.exports.reload = process =>
  new Promise((resolve, reject) => {
    pm2.reload(process, callback(resolve, reject))
  })

module.exports.restart = process =>
  new Promise((resolve, reject) => {
    pm2.restart(process, callback(resolve, reject))
  })

module.exports.delete = process =>
  new Promise((resolve, reject) => {
    pm2.delete(process, callback(resolve, reject))
  })
