var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var utils = require('../utils');
var btoa = require('btoa');
var nobi = require('nobi');
var crypto = require('crypto');
var signer = nobi(utils.getConfig('appKey'));
var uuid = require('node-uuid');

var loginKeys = {};

function sha(text) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(text);
    return sha256.digest('hex');
}

function login(loginObj, cb) {
    loginkey = unescape(loginObj.loginKey);
    try {
        signer.unsign(loginKeys[loginkey]);
    } catch (e) {
        return {
            msg: 'error! loginKey is ' + loginkey,
            success: false
        };
    }
    var userCol = db.get('users');
    var shapwd = sha(loginObj.password);
    shapwd = loginObj.password;
    var userid = loginObj.userid;
    userid = parseInt(userid);
    if(isNaN(userid))
        userid = loginObj.userid;

    userCol.findOne({
        userid: userid,
        password: shapwd
    }, {}, cb);
}

function loginpage(req, res, next) {
    var timestamp = btoa(new Date().getTime());
    var signiture = signer.sign(timestamp);
    var parts = signiture.split('.');
    loginKeys[parts[1]] = signiture;
    pageUrl = req.url;
    if(req.path === '/login')
        pageUrl = '/staff_main'
    res.render('login', {
        loginKey: parts[1],
        pageUrl: pageUrl,
        tr: res.__
    });
}

function postLogin(req, res, next) {
    var ret = login(req.body, function(err, doc) {
        if (err)
            return res.render('message', {
                msg: err,
                success: false
            });
        if (!doc)
            return res.render('message', {
                msg: 'username or password error!',
                success: false
            });

        var sessionObj = {
            sessionid: uuid.v1(),
            userid: doc.userid,
            name: doc.name,
            compid: doc.compid,
            ip: req.ip,
            compowner: doc.owner
        };

        var session = db.get('session');
        session.insert(sessionObj, function(err, doc) {
            if (err)
                throw err;
            res.cookie('sessionid', sessionObj.sessionid, {
                maxAge: 24 * 3600 * 1000,
                httpOnly: true
            });
            res.render('message', {
                msg: 'Login Success!',
                success: true,
                pageUrl: req.body.pageUrl
            });
        });

    });
    if (ret)
        res.render('message', ret);
}

/* GET home page. */


router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', {
        title: 'Express',
        ret: results
    });
});

router.get('/login', loginpage);
router.post('/login', postLogin);

router.get('/logout', function(req, res, next) {

    var sessionCol = db.get('session');
    sessionCol.findOne({sessionid: req.cookies.sessionid}, {}, function(err, doc){
        if(doc) {
            sessionCol.remove({userid: doc.userid}, function(err){
                if(err)
                    return next(err);
                res.clearCookie('sessionid');
                res.redirect('/login');
            })
        } else {
            res.clearCookie('sessionid');
            res.redirect('/login')
        }
    });
});

router.get('/message', function(req, res, next){

    res.render('message', {msg:'Hello'});
});

router.get('/testdb', function(req, res, next) {

    db.get('users').find({}, {}, function(err, docs) {

        res.render('message', {
            msg: 'Haha, Test Successfully! The docs count is ' + docs.length,
            success: true
        });
    });
});

router.get('/cookies', function(req, res, next) {
    var cookies = req.cookies;
    var cookie_str = "";
    for (var key in cookies) {
        cookie_str += key + "=" + cookies[key] + ";<br/>";
    }
});
router.getLoginPage = loginpage;

module.exports = router;
