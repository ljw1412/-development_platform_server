/* 安全性校验中间件 */
whitelist = [{ path: '/users/.*$' }]

module.exports = async (ctx, next) => {
  const filtered = whitelist.filter(
    item =>
      new RegExp(item.path).test(ctx.path) &&
      (!item.method || ctx.method === item.method.toUpperCase())
  )
  console.log(ctx.path, filtered)
  // console.log(ctx.req.headers)
  await next()
}
