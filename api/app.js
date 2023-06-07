var createError = require('http-errors');
var express = require('express');
const mysql = require('mysql2');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var favicon = require('serve-favicon')

var indexRouter = require('./routes/index');
var verifyRouter = require('./routes/verify');
var recentPostersRouter = require('./routes/recentPosters');
var userRouter = require('./routes/user');
var testAPIRouter = require("./routes/test");
var imageRouter = require("./routes/image");
var postRouter = require("./routes/posts");
var trendRouter = require("./routes/trends");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors({
  origin: ['https://www.fromeroad.com', 'https://fromeroad.com', 'https://dev.fromeroad.com'],
  methods: '*',
  allowedHeaders: ['Authorization', 'Content-Type'],
  preflightContinue: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use('/data', express.static('data'));

app.use('/', indexRouter);
app.use('/verify', verifyRouter);
app.use('/recentPosters', recentPostersRouter);
app.use('/user', userRouter);
app.use("/test", testAPIRouter);
app.use("/image", imageRouter);
app.use("/post", postRouter);
app.use("/trends", trendRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status).send({
    message: err.message
  })
});

module.exports = app;
