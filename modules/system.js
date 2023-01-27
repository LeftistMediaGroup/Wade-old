// Allow require
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var https = require('https');

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const session = require('express-session');
var logger = require('morgan');
var cors = require('cors');

import registerRouter from './routes/register.js';
import musicRouter from './routes/music.js';
import systemSocketRouter from '../systemSocket.js';


export default function system() {
  // ssl init
  var privateKey = fs.readFileSync('./ssl/wade_key.pem');
  var certificate = fs.readFileSync('./ssl/wade.pem');
  var credentials = {key: privateKey, cert: certificate};

  app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
  }));

  app.set('port', 4000)

  httpsServer.listen(app.get('port'), () => {
    console.log(`System is listening on port ${app.get('port')}`);
  });

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.set('trust proxy', 1) // trust first proxy

  //BodyParser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  //Init session
  app.use(session({ 
    secret: 'keyboard cat',
    cookie: { maxAge: 60000, httpOnly: true },
    credentials: true,
    saveUninitialized: false,
    resave: true
  }))

  // Use Router
  app.use("/register", registerRouter);
  app.use("/music", musicRouter);
  app.use("/systemSocket", systemSocketRouter);

  app.use(cookieParser());

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
};