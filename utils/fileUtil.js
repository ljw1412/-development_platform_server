// The fs.promises API is experimental
const fsp = require('fs').promises
const pth = require('path')

const getFileType = stats => {
  return stats.isDirectory() ? 'dir' : stats.isFile() ? 'file' : 'other'
}

const listDir = async (path, displayHidden = false) => {
  try {
    await fsp.access(path)
    const filenameList = await fsp.readdir(path)
    const fileList = []
    for (let i = 0; i < filenameList.length; i++) {
      const name = filenameList[i]
      // 过滤隐藏文件
      if (!displayHidden && /^\./.test(name)) continue
      const fileStats = await fsp.stat(pth.join(path, name))
      fileStats.type = getFileType(fileStats)
      fileStats.name = name
      fileList.push(fileStats)
    }
    return fileList
  } catch (err) {
    console.log(err.message)
    let error = ''
    if (err.message.includes('no such')) {
      error = `path: '${path}' is not exists`
    }
    return { error: error || err.message }
  }
}

module.exports = { listDir }
