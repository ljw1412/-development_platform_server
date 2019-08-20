/* 安全性校验中间件 */
const jwt = require('jsonwebtoken')
const User = require('../serves/database/models/User')

whitelist = [{ path: '/users/login$', method: 'post' }]

const isInWhitelist = (path, method) => {
  const filterList = whitelist.filter(
    item =>
      new RegExp(item.path).test(path) &&
      (!item.method || method === item.method.toUpperCase())
  )
  return !!filterList.length
}

module.exports = async (ctx, next) => {
  if (isInWhitelist(ctx.path, ctx.method)) return await next()

  const auth = ctx.cookies.get('token')
  if (!auth) {
    return ctx.throw(401, 'Unauthorized.')
  }
  let user = {}
  try {
    user = jwt.verify(auth, global.config.SECRET_KEY)
    const userInDB = await User.findUserById(user.id)
    if (userInDB.error) throw new Error(userInDB.error)
    user = userInDB
  } catch (error) {
    console.error(error)
    return ctx.throw(403, 'Invalid token.')
  }
  ctx.currentUser = user
  await next()
}
