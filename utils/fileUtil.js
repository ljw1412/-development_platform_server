// The fs.promises API is experimental
const fsp = require('fs').promises
const pth = require('path')

const getFileType = stats => {
  return stats.isDirectory() ? 'dir' : stats.isFile() ? 'file' : 'other'
}

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
