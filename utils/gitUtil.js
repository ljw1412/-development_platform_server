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

exports.cloneRepository = async (path, url) => {
  try {
    const { stdout, stderr } = await execFile('git', ['clone', url, path])
    return { message: stdout || stderr }
  } catch (error) {
    return { error }
  }
}
