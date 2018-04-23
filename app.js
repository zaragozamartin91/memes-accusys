var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var dbManager = require('./model/db-manager');
var pgSession = require('connect-pg-simple')(session);
var sessionInitializer = require('./utils/session-init');

var userLoadMiddleware = require('./middleware/userLoad');
var messages = require('./middleware/messages');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var memesRouter = require('./routes/memes');
var testsRouter = require('./routes/tests');

var app = express();
app.set('env', 'development');

const BASE_DIR = process.env.BASE_DIR || __dirname;
process.env.BASE_DIR = BASE_DIR;
const IMG_DIR = process.env.IMG_DIR || path.join(BASE_DIR, 'public', 'images');
process.env.IMG_DIR = IMG_DIR;
const MEME_IMG_DIR = path.join(IMG_DIR, 'memes');
process.env.MEME_IMG_DIR = MEME_IMG_DIR;

fs.exists(MEME_IMG_DIR, exists => { if (!exists) fs.mkdir(MEME_IMG_DIR) });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1) // trust first proxy

sessionInitializer.initialize().then(() => {
    console.log('Configurando manejador de sesiones');
    app.use(session({
        store: new pgSession({
            pool: dbManager.poolWrapper.pool,  // Connection pool  
        }),
        saveUninitialized: true,
        resave: true,
        secret: 'memes de accoses',
        cookie: {
            maxAge: 1000 * 60 * 60,
            secure: app.get('env') === 'production'
        }
    }));
    console.log('Manejador de sesiones configurado');

    /*cargamos el middleware de usuarios para inyectar el usuario en cada request*/
    app.use(userLoadMiddleware);
    /*Agregamos el middleware para trabajar con mensajes en cada redirect...*/
    app.use(messages);

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/memes', memesRouter);
    app.use('/tests', testsRouter);

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
}).catch(cause => {
    console.error(cause);
    process.exit(1);
});


module.exports = app;
