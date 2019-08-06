// The fs.promises API is experimental
const fsp = require('fs').promises
const pth = require('path')

const getFileType = stats => {
  return stats.isDirectory() ? 'dir' : stats.isFile() ? 'file' : 'other'
}

/**
 * 获取指定路径下的文件或文件夹
 * @param object
 * path 指定路径
 * onlyDir 是否只获取文件夹
 * displayHidden 是否显示隐藏文件
 */
const listDir = async ({ path, onlyDir = false, displayHidden = false }) => {
  try {
    await fsp.access(path)
    const filenameList = await fsp.readdir(path)
    const fileList = []
    for (let i = 0; i < filenameList.length; i++) {
      try {
        const name = filenameList[i]
        // 过滤隐藏文件
        if (!displayHidden && /^\./.test(name)) continue
        const fileStats = await fsp.stat(pth.join(path, name))
        fileStats.type = getFileType(fileStats)
        fileStats.name = name
        if (!onlyDir || (onlyDir && fileStats.type === 'dir')) {
          fileList.push(fileStats)
        }
      } catch (error) {}
    }
    return [
      ...fileList.filter(item => item.type === 'dir'),
      ...fileList.filter(item => item.type === 'file')
    ]
  } catch (err) {
    console.log(err.message)
    let error = ''
    if (err.message.includes('no such')) {
      error = `path: '${path}' is not exists`
    }
    return { error: error || err.message }
  }
}

const isExists = path => fsp.access(path, fs.constants.F_OK)

/**
 * 格式化文件大小
 * @param {number} size 文件大小
 * @param {number} index 传入大小为哪个单位的 0为 B (字节)
 */
const formatFileSize = (size, index = 0) => {
  const unitList = ['B', 'KB', 'MB', 'GB', 'PB']
  let i = index
  while (size / 1024 > 1) {
    size /= 1024
    i++
  }
  return size.toFixed(2) + unitList[i]
}

module.exports = { listDir, formatFileSize }
