var express        = require('express');
var path           = require('path');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var i18n           = require('i18n');
var authentication = require('./authentication');
var routes         = require('./routes/index');
var users          = require('./routes/users');
var delegate       = require('./routes/delegate');
var comp           = require('./routes/comp');
var company        = require('./routes/company');
var usersettings   = require('./routes/usersettings');
var records        = require('./routes/records');
var yongred        = require('./routes/yongred');
var utils          = require('./utils');
var mongo          = require('mongodb');
var monk           = require('monk');
var moment        = require('moment');
var app            = express();

var db = monk(utils.getConfig('mongodbPath'));

//var db=monk('mogodb:127.0.0.1:27017/punchtest');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.moment = moment;

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*app.use(function(req, res, next) {
    req.db = db;
    next();
});*/

//app.use(authentication());


i18n.configure({
    locales: ['cn','en'],
    directory: path.join(__dirname, 'i18n/locales'),
    defaultLocale: 'cn',
    cookie: 'lang'
});

app.use(function(req, res, next) {
    var lang = req.cookies.lang;
    if(lang)
        i18n.setLocale(lang);
    res.__ = i18n.__;
    return next();
});

app.use(function(req, res, next) {
    req.db = db;
    next();
});

app.use(authentication());

app.use('/', routes);
app.use('/', yongred);
app.use('/', records);
app.use('/users', users);
app.use('/comp', comp);
app.use('/company', company)
app.use('/delegate', delegate);
app.use('/comp', comp);
app.use('/', usersettings)

// catch 404 and forward to error handler

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
