const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var cors = require('cors')
// var bodyParser = require('body-parser')
var getRawBody = require('raw-body')
const app = express();

// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors())

app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf-8'
  }, function (err, string) {
    if (err) return next(err)
    req.text = string
    next()
  })
})


let chromeSocket;

app.setSocket = function(socket){
  console.log("Set Socket"); // open mobile.html first!!!
  chromeSocket = socket;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// endpoint for sending messages to chrome
app.get('/proxy',  function(req, res){
  if (chromeSocket){
    chromeSocket.emit("mensaje", req.query);
  }
  res.send(req.query);
});

app.post('/proxy',  function(req, res){
  if (chromeSocket){
    chromeSocket.emit("mensaje", req.text);
  }
  console.log(req.text);
  res.send(req.text);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
