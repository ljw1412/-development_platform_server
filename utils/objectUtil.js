// 根据 keys 筛选对象
// ps: obj = {a:1,b:2,c:3,d:4}  only(obj,'a b') => {a:1,b:2}
module.exports.only = function(obj, keys) {
  obj = obj || {}
  if ('string' == typeof keys) keys = keys.split(/ +/)
  return keys.reduce(function(ret, key) {
    if (null == obj[key]) return ret
    ret[key] = obj[key]
    return ret
  }, {})
}
