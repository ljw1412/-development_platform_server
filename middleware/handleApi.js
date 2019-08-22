// 接口处理中间件

module.exports = async (ctx, next) => {
  await next()
  // 如果返回的内容为对象 且里有 error 字段 抛出500
  if (ctx.body) {
    if (ctx.body.error) {
      return ctx.throw(500, ctx.body.error)
      // ctx.status = 500
      // ctx.body = ctx.body.error
    }
  }
}
