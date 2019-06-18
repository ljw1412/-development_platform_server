// 接口处理中间件

module.exports = async (ctx, next) => {
  await next()
  if (ctx.body && ctx.body.error) {
    ctx.status = 500
    ctx.body = ctx.body.error
  }
}
