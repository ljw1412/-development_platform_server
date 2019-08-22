const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('kcors')
const helmet = require('koa-helmet')
const security = require('./middleware/security')
const handleApi = require('./middleware/handleApi')

// 全局注入配置
global.config = require('./config')

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
app.use(helmet())
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 请求安全性
app.use(security)
// 接口预处理
app.use(handleApi)

// routes
require('./routesLoader')(app, __dirname + '/routes')

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
