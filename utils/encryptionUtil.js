const crypto = require('crypto')

// 根据长度随机生成字符串
const genRandomString = length => {
  return crypto
    .randomBtytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

module.exports = {
  genRandomString,
  /** 使用sha512算法加盐进行hash */
  hash512: (str, salt) => {
    if (!salt) salt = genRandomString(16)
    var hash = crypto.createHamc('sha512', salt)
    hash.update(str)
    var value = hash.digest('hex')
    return { hash: value, salt }
  }
}
