const pm2 = require('pm2')
const fileUtil = require('../utils/fileUtil')
const moment = require('moment')

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

module.exports.formatProcessDescription = item => ({
  pid: item.pid,
  name: item.name,
  pmid: item.pm_id,
  memory: fileUtil.formatFileSize(item.monit.memory),
  cpu: item.monit.cpu + '%',
  createTime: item.pm2_env.created_at,
  uptime: moment(item.pm2_env.pm_uptime).fromNow(true),
  restartTime: item.pm2_env.restart_time,
  status: item.pm2_env.status,
  version: item.pm2_env.version,
  watch: item.pm2_env.watch,
  path: item.pm2_env.pm_exec_path,
  protected: item.pm2_env.PWD === process.env.PWD
})
