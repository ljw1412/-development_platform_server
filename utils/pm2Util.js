const pm2 = require('pm2')
const fileUtil = require('../utils/fileUtil')
const moment = require('moment')
const fsp = require('fs').promises

const callback = (resolve, reject) => (err, data) => {
  if (err) reject(err)
  return resolve(data)
}

exports.list = () =>
  new Promise((resolve, reject) => {
    pm2.list(callback(resolve, reject))
  })

exports.describe = process =>
  new Promise((resolve, reject) => {
    pm2.describe(process, callback(resolve, reject))
  })

exports.start = options =>
  new Promise((resolve, reject) => {
    pm2.start(options, callback(resolve, reject))
  })

exports.start = (script, options) =>
  new Promise((resolve, reject) => {
    pm2.start(script, options, callback(resolve, reject))
  })

exports.stop = process =>
  new Promise((resolve, reject) => {
    pm2.stop(process, callback(resolve, reject))
  })

exports.reload = process =>
  new Promise((resolve, reject) => {
    pm2.reload(process, callback(resolve, reject))
  })

exports.restart = process =>
  new Promise((resolve, reject) => {
    pm2.restart(process, callback(resolve, reject))
  })

exports.delete = process =>
  new Promise((resolve, reject) => {
    pm2.delete(process, callback(resolve, reject))
  })

exports.formatProcessDescription = item => ({
  pid: item.pid,
  name: item.name,
  pmid: item.pm_id,
  memoryByte: item.monit.memory,
  memory: fileUtil.formatFileSize(item.monit.memory),
  cpuPercentage: item.monit.cpu,
  cpu: item.monit.cpu + '%',
  createTime: item.pm2_env.created_at,
  uptime: moment(item.pm2_env.pm_uptime).fromNow(true),
  restartTime: item.pm2_env.restart_time,
  status: item.pm2_env.status,
  version: item.pm2_env.version,
  watch: item.pm2_env.watch,
  path: item.pm2_env.pm_exec_path,
  protect: item.pm2_env.PWD === process.env.PWD
})

exports.readLog = async (id, lineNum = -15) => {
  const data = await this.describe(id)
  const { pm_out_log_path, pm_err_log_path } = data[0].pm2_env
  const logs = await fsp.readFile(pm_out_log_path, 'utf8')
  const line = logs.split('\n')
  // console.log(pm_out_log_path, pm_err_log_path)
  return {
    line: line.slice(lineNum, line.length - 1),
    lineNum: line.length - 1
  }
}
