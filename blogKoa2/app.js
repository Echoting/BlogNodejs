const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const redisStore = require('koa-redis')
const session = require('koa-generic-session')

const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blogs = require('./routes/blog')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志处理，分环境，产品环境中将日志写入文件，开发环境放控制台就好，这里主要是access log
// 自定义日志主要用console.log()，或者console.error()来做
// app.use(logger('dev'));
const isDev = process.env.NODE_ENV !== 'production';
if (isDev) {
    app.use(morgan('dev'));
} else {
    const fullFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a' // a 是追加，w是覆盖
    });

    app.use(morgan('combined', {
        stream: writeStream
    }))
}


// session 配置
app.keys = ['JEFkj_345@o']
app.use(session({
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    },

    store: redisStore({
        all: '127.0.0.1:6379'  // test 先写死本地的redis
    })
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blogs.routes(), blogs.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
