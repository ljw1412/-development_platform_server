const os = require('os')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

/**
 * 获取系统版本
 */
module.exports.getSystemVersion = async () => {
  try {
    const { stdout, stderr } = await exec('lsb_release -a')
    const matchList = stdout.match(/Description:\t(.+)\n/)
    return Array.isArray(matchList) && matchList.length > 1
      ? matchList[1]
      : os.type()
  } catch (error) {
    return os.type()
  }
}

/**
 * 获取负载1、5、15 分钟平均负载
 */
module.exports.getLoadAvg = os.loadavg

/**
 * 操作系统运行的时间(秒)
 */
module.exports.getUptime = os.uptime

/**
 * 内存(已使用/总共)
 */
module.exports.getMemory = () => ({
  free: os.freemem(),
  total: os.totalmem()
})

/**
 * cpu信息
 */
module.exports.getCpu = os.cpus

/**
 * 网络接口列表
 */
module.exports.getNetworkInterfaces = os.networkInterfaces

/**
 * 获取主机名称
 */
module.exports.getHostname = os.hostname
