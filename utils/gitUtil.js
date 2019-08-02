const Git = require('nodegit')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const GIT_URL_REGEX = /^(git|https?).*\.git$/

/**
 * 检查是否为有效仓库
 * @param {*} url Repository Url
 */
exports.isVaildRepository = async url => {
  if (GIT_URL_REGEX.test(url)) {
    try {
      const { stdout } = await execFile('git', ['ls-remote', url])
      return { valid: true, out: stdout }
    } catch ({ stderr }) {
      return { valid: false, out: stderr }
    }
  }
  return { valid: false, out: 'format is incorrect' }
}
