var express = require('express');
var router  = express.Router();
var monk    = require('monk');
var db      = monk('mongodb://localhost:27017/punchsystem');
var utils   = require('../utils');
var btoa    = require('btoa');
var nobi    = require('nobi');
var crypto  = require('crypto');
var signer  = nobi(utils.getConfig('appKey'));
var uuid    = require('node-uuid');
var util    = require('util');
var moment  = require('moment');

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
    utils.render('login', {
        loginKey: parts[1],
        pageUrl: pageUrl,
        tr: res.__
    })(req, res, next);
}

function postLogin(req, res, next) {
    var ret = login(req.body, function(err, doc) {
        if (err)
            return res.render('message', {
                msg: err,
                success: false
            });
        if (!doc)
            return utils.render('message', {
                msg: { head: 'LOGIN FAILED', body: 'username or password error!' },
                success: false
            })(req, res, next);

        var sessionObj = {
            sessionid: uuid.v1(),
            userid: doc.userid,
            name: doc.name,
            compid: doc.compid,
            ip: req.ip,
            compowner: doc.owner
        };

        var session = db.get('session');
        session.findAndModify(
                { userid: doc.userid },
                { $set: sessionObj },
                { new: true, upsert: true }, 
        function(err, sDoc) {
            if (err)
                throw err;
            res.cookie('sessionid', sDoc.sessionid, {
                maxAge: 24 * 3600 * 1000,
                httpOnly: true
            });
            var pageUrl = req.body.pageUrl;
            pageUrl = pageUrl === '/staff_main' ? 
                        sDoc.compowner ? 
                        "/supervisor/supervisor_main" : pageUrl 
                        : pageUrl;
            utils.render('message', {
                msg: {head : 'LOGIN SUCCESSFULLY!', body: 'Hello ' + doc.name + ", Welcome to our system"},
                success: true,
                pageUrl: pageUrl 
            })(req, res, next);
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

var recordsModule = require('../recordsModule');

function punchData(record, msg, userInfo) {

    var punchout = !!record.outDate;                    
    var punchtime = punchout ? record.outDate : record.inDate;
    var datetime = moment(punchtime);
    msg = util.format(msg, 
            userInfo.name, 
            punchout ? "OUT" : "IN",
            datetime.format("YYYY-MM-DD"),
            datetime.format("HH:mm A"));
    return { 
        success: true,
        msg: msg,
        record: record, 
        punchout: punchout,
        pageUrl: '/staff_main'
    }
}

router.get('/punch/:key', function(req, res, next){
    var rm = new recordsModule({db:req.db});
    var key = req.params.key;
    var parts = key.split('.');
    key = utils.base64URLSafeDecode(parts[1]);
    var qrid = signer.unsign(parts[0]+'.'+key);
    rm.checkQrcode(qrid, req.cookies.sessionid, function(valid, userInfo){
        if(valid) {
            rm.punch(userInfo.userid, function(err, record){ 
                var msg = res.__('punch_success');
                utils.render('message', punchData(record, msg, userInfo))(req, res, next);
            });
        }
    });

});

var qrModule = require('../qrcodeModule');

router.get('/showdynacode', function(req, res, next){
    var qrm = new qrModule({db:req.db});
    
    qrm.getDynacode(req.cookies.sessionid, function(err, mixinData){
        console.log(mixinData);
        utils.render('testqrcode', {data: mixinData})(req, res, next); 
    });
});

router.get('/recentRecords', function(req, res, next){
    var rm = new recordsModule({db:req.db});
    rm.rencentRecords({sessionid:req.cookies.sessionid}, function(err, recordDocs){

        utils.render('staff/staff_punch_report', { 
                     moment: moment, 
                     records: recordDocs 
                     })(req, res, next);
        
    });
});

var sModule = require('../sessionModule');

router.get('/supervisor/adminpunch', function(req, res, next){
    var sm = new sModule({db:req.db});
    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj){
        if(err || !sObj)
            return next(err||new Error('invalid user!'));

        sm.db.get('companies').findOne({compid: sObj.compid},{}, function(err, comp){
            sm.db.get('users').find({compid: comp.compid}, {}, function(err, users){

                utils.render('adminpunch', {
                    companyName:comp.name,
                    users: users
                })(req, res, next);
            });

        });

    });
});

router.get('/supervisor/rencentRecords/:uid', function(req, res, next){
    var rm = new recordsModule({db:req.db});
    var uid = req.params.uid;
    rm.rencentRecords(uid, function(err, recordDocs){
        utils.render('staff/staff_punch_report', { 
                     moment: moment, 
                     records: recordDocs 
                     })(req, res, next);
        
    });
});

//router.get('/dynapunch/:key', function(req, res, next){
//    var rm = new recordsModule(req.db);
//    var key = req.params.key;
//    var parts = key.split('.');
//    key = utils.base64URLSafeDecode(parts[1]);
//    var qrid = signer.unsign(parts[0]+'.'+key);
//    rm.checkDynaQrcode(qrid, req.cookies.sessionid, function(valid, userInfo){
//        if(valid) {
//            rm.punch(userInfo.userid, function(err, record){ 
//                var msg = res.__('punch_success');
//                utils.render('message', punchData(record, msg, userInfo))(req, res, next);
//            });
//        }
//    });
//
//});

router.get('/message', utils.render('message', {msg:{head:'Hello', body:"we are still testing although it is 7:20PM now!!"}, success:false}));

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
