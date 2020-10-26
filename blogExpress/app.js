var createError = require('http-errors');
var express = require('express');
var path = require('path');

const session = require('express-session');
const redisStore = require('connect-redis')(session);

// 解析cookie
var cookieParser = require('cookie-parser');

// 生成日志
var logger = require('morgan');

// 路由
// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blotRouter = require('./routes/blog.js');

var app = express();

// view engine setup 暂时不考虑前端页面
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

// 处理post接口的数据，放在req.body上，且兼容其他格式
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie
app.use(cookieParser());

const redisClient = require('./database/redis');
const sessionStore = new redisStore({
	client: redisClient
})
app.use(session({
	secret: 'Ec2343@',
	'resave': false,
	saveUninitialized: true,
	cookie: {
		// path: '/',  // 默认配置
		// httpOnly: true,  // 默认配置
		maxAge: 24 * 60 * 60 * 1000,  // 失效时间
	},
	store: sessionStore
}));

// 暂时不考虑前端页面
app.use(express.static(path.join(__dirname, 'public')));

// 注册路由
// app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/blog', blotRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
