/* Importing required pakages */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const config = require('config');
const mysql = require("mysql2/promise");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/* Importing various endpoint routes */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Coin = require('./routes/CoinRouter');
var Token = require('./routes/TokenRouter');
var crtADD = require('./routes/crtAddRouter');
var Contract = require('./routes/ContractRouter');
var Transaction = require('./routes/TransRouter');
var XRP = require('./routes/XRPRouter');
var USDTbal = require('./routes/balUSDTrouter');
var pastexplr = require('./routes/pastexplr');
var ddbl = require('./routes/DDBLRouter');
var bnbhist = require('./routes/bnbhistRouter');
var addressRouter = require('./routes/addressRouter');
// var stellar = require('./routes/stellarRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* Using the imported pakages. */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Using the imported routes */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/coin', Coin);
app.use('/token', Token);
app.use('/crtAdd', crtADD);
app.use('/Contract', Contract);
app.use('/transaction', Transaction);
app.use('/XRP', XRP);
app.use('/USDTbal', USDTbal);
app.use('/pastexplr',pastexplr);
app.use('/ddbl', ddbl);
app.use('/bnbhist', bnbhist);
app.use('/address', addressRouter);
// app.use('/stellar', stellar);

app.use(function(req, res, next) {
/** catch 404 and forward to error handler */
  next(createError(404));
});

app.use(function(err, req, res, next) {
  /** Error handler, set locals, only providing error in development and render the error page */
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

async function main(){
/** Sets up connection to database */
  db = await mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    timezone: config.get('db.timezone'),
    charset: config.get('db.charset')
  });
  console.log("Connected!\n")
}
main();

module.exports = app;
