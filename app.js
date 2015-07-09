var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var i18n = require('i18n');
var authentication = require('./authentication');

var routes = require('./routes/index');
var users = require('./routes/users');
var delegate = require('./routes/delegate');
var comp = require('./routes/comp');

var company = require('./routes/company');
var usersettings = require('./routes/usersettings');

var records = require('./routes/records');
var yongred = require('./routes/yongred');



var mongo = require('mongodb');
var monk = require('monk');
var db = monk('127.0.0.1:27017/punchsystem');

var app = express();


//var db=monk('mogodb:192.168.1.112/punchtest');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    req.db = db;
    next();
});
<<<<<<< HEAD

=======
>>>>>>> 58b076c219f95d6248f1942c9de1fba20ad37cec
app.use(authentication());

i18n.configure({
    locales: ['en', 'cn'],
    directory: path.join(__dirname, 'i18n/locales'),
    defaultLocale: 'cn',
    cookie: 'lang'
});
//
app.use(function(req, res, next) {
    req.db = db;
    next();
})

app.use(function(req, res, next) {
    i18n.init(req, res);
    return next();
});

app.use('/', routes);
app.use('/', yongred);
app.use('/users', users);
app.use('/comp', comp);

app.use('/company', company)

app.use('/records', records);

app.use('/delegate', delegate);
app.use('/comp', comp);

app.use('/usersettings', usersettings)


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
