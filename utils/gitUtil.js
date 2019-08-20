const git = require('simple-git/promise')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

const GIT_URL_REGEX = /^(git|https?).*\.git$/

/**
 * 检查是否为有效仓库
 * @param {*} url Repository Url
 */
exports.isVaildRepository = async url => {
  // if (!GIT_URL_REGEX.test(url))
  //   return { valid: false, out: `repository '${url}' format is incorrect` }
  try {
    await git().listRemote([url])
    return { valid: true, out: '' }
  } catch (error) {
    return { valid: false, out: `repository '${url}' not found` }
  }
}

exports.cloneRepository = async (path, url) => {
  try {
    await git().clone(url, path)
    return { message: `repository '${url}' cloned to '${path}'.` }
  } catch (error) {
    return { error }
  }
}

exports.statusRepository = async path => {
  try {
    return await git(path).status()
  } catch (error) {
    return { error }
  }
}
