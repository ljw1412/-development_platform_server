// 根据 keys 筛选对象
// ps: obj = {a:1,b:2,c:3,d:4}  only(obj,'a b') => {a:1,b:2}
function only(obj, keys) {
  obj = obj || {}
  if ('string' == typeof keys) keys = keys.split(/ +/)
  return keys.reduce(function(ret, key) {
    if (null == obj[key]) return ret
    ret[key] = obj[key]
    return ret
  }, {})
}

function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Error]': 'error'
  }
  return map[toString.call(obj)]
}

// 重命名 mongodb 的 _id 为 id
function renameId(data) {
  const t = typeOf(data)
  if (['array', 'object'].includes(t)) {
    if (t === 'array') {
      for (let i = 0; i < data.length; i++) {
        renameId(data[i])
      }
    } else if (t === 'object') {
      if (data._id && !data.id) {
        data.id = data._id
        delete data._id
      }
      for (const i in data) {
        renameId(data[i])
      }
    }
  }
  return data
}

module.exports = { only, typeOf, renameId }
