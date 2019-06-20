const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('kcors')
const security = require('./middleware/security')
const apiError = require('./middleware/apiError')
const config = require('./config')

// Initialize the database 初始化数据库
require('./serves/database')

// error handler
onerror(app)

// middlewares
app.use(
  cors({
    origin: ctx => ctx.header.origin,
    optionsSuccessStatus: 200,
    credentials: true // 是否带cookie
  })
)
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// 请求安全性
// app.use(security)
// 接口异常自动500
app.use(apiError)

// routes
require('./routesLoader')(app, __dirname + '/routes')

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
