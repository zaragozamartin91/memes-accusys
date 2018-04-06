var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var dbManager = require('./model/db-manager');
var pgSession = require('connect-pg-simple')(session);

var userLoadMiddleware = require('./middleware/userLoad');
var messages = require('./middleware/messages');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.set('env', 'development');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy

app.use(session({
  store: new pgSession({
    pool: dbManager.poolWrapper.pool,  // Connection pool  
  }),
  saveUninitialized: true,
  resave: true,
  secret: 'memes de accoses',
  cookie: {
    maxAge: 1000 * 60 * 10, // sesion de un minuto
    secure: app.get('env') === 'production'
  }
}));

/*cargamos el middleware de usuarios para inyectar el usuario en cada request*/
app.use(userLoadMiddleware);
/*Agregamos el middleware para trabajar con mensajes en cada redirect...*/
app.use(messages);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
