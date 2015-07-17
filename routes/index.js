var express = require('express');
var router = express.Router();
var monk = require('monk');
var utils = require('../utils');
var db = monk(utils.getConfig('mongodbPath'));
var btoa = require('btoa');
var nobi = require('nobi');
var crypto = require('crypto');
var signer = nobi(utils.getConfig('appKey'));
var uuid = require('node-uuid');
var util = require('util');
var moment = require('moment');

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
    if (isNaN(userid))
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
    if (req.path === '/login')
        pageUrl = '/staff_main';
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
                msg: {
                    head: 'LOGIN FAILED',
                    body: err.message
                },
                success: false
            });
        if (!doc)
            return utils.render('message', {
                msg: {
                    head: 'LOGIN FAILED',
                    body: 'username or password error!'
                },
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
        session.findAndModify({
                userid: doc.userid
            }, {
                $set: sessionObj
            }, {
                new: true,
                upsert: true
            },
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
                    "/supervisor/supervisor_main" : pageUrl : pageUrl;
                utils.render('message', {
                    msg: {
                        head: 'LOGIN SUCCESSFULLY!',
                        body: 'Hello ' + doc.name + ", Welcome to our system"
                    },
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
    sessionCol.findOne({
        sessionid: req.cookies.sessionid
    }, {}, function(err, doc) {
        if (doc) {
            sessionCol.remove({
                userid: doc.userid
            }, function(err) {
                if (err)
                    return next(err);
                res.clearCookie('sessionid');
                res.redirect('/login');
            });
        } else {
            res.clearCookie('sessionid');
            res.redirect('/login');
        }
    });
});

var recordsModule = require('../recordsModule');

function punchData(record, msg, userInfo) {

    var punchout = !!record.outDate;
    var punchtime = punchout ? record.outDate : record.inDate;
    var datetime = moment(punchtime);
    msg.body = util.format(msg.body,
        punchout ? "OUT" : "IN",
        datetime.format("YYYY-MM-DD"),
        datetime.format("hh:mm A"));
    return {
        success: true,
        msg: msg,
        record: record,
        punchout: punchout,
        pageUrl: userInfo.owner ? '/supervisor/supervisor_main' : '/staff_main'
    };
}

router.get('/punch/:key', function(req, res, next) {
    var rm = new recordsModule();
    var key = req.params.key;
    var parts = key.split('.');
    key = utils.base64URLSafeDecode(parts[1]);
    var qrid = signer.unsign(parts[0] + '.' + key);
    rm.checkQrcode(qrid, req.cookies.sessionid, function(valid, userInfo) {
        var msg;
        if (valid) {
            msg = {
                head: res.__('punchSuccessHead'),
                body: res.__('punchSuccess')
            };
            rm.punch(userInfo.userid, function(err, record) {
                rm.db.close();
                utils.render('message', punchData(record, msg, userInfo))(req, res, next);
            });
        } else {
            msg = {
                head: res.__('punchFailedHead'),
                body: res.__('punchFailed')
            };
            utils.render('message', {
                success: false,
                msg: msg,
                pageUrl: '/logout'
            })(req, res, next);
        }
    });

});

/*
var qrModule = require('../qrcodeModule');
router.get('/supervisor/showdynacode', function(req, res, next) {
    var qrm = new qrModule();
    qrm.getDynacode(req.cookies.sessionid, function(err, mixinData) {
        qrm.db.close();
        utils.render('qr', {
            data: mixinData
        })(req, res, next);
    });
});
*/
router.get('/recentRecords', function(req, res, next) {
    var rm = new recordsModule();
    rm.rencentRecords({
        sessionid: req.cookies.sessionid
    }, function(err, recordDocs) {
        rm.db.close();
        utils.render('staff/staff_punch_report', {
            moment: moment,
            records: recordDocs
        })(req, res, next);

    });
});

var sModule = require('../sessionModule');

router.get('/supervisor/adminpunch', function(req, res, next) {
    var sm = new sModule();
    var rm = new recordsModule({
        db: sm.db
    });
    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {
        if (err || !sObj)
            return next(err || new Error('invalid user!'));
        sm.db.get('companies').findOne({
            compid: sObj.compid
        }, {}, function(err, comp) {
            rm.findLastRecordsByCompid(sObj.compid, function(err, mixinData) {
                utils.render('adminpunch', {
                    companyName: comp.name,
                    users: mixinData.users,
                    lastRecords: mixinData.lastRecords
                })(req, res, next);
                sm.db.close();
            });

        });

    });
});

router.post('/supervisor/adminpunch', function(req, res, next) {
    var rm = new recordsModule();
    var userIdCommaList = req.body.userIdList;
    var userList = userIdCommaList.split(',');

    rm.punchMany(userList, function(err, records) {
        rm.db.close();
        if (err) {
            return next(err);
        }
        res.redirect(302, '/supervisor/adminpunch');
    });

});



router.get('/supervisor/rencentRecords/:uid', function(req, res, next) {
    var rm = new recordsModule();
    var uid = req.params.uid;
    rm.rencentRecords(uid, function(err, recordDocs) {
        rm.db.close();
        utils.render('supervisor/supervisor_punch_report', {
            moment: moment,
            records: recordDocs,
            userid: uid,
        })(req, res, next);
    });
});


var userMoudle = require('../usermodule');

router.get('/supervisor/employees', function(req, res, next) {
    var um = new userMoudle();
    var sm = new sModule(um.db);
    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {

        console.log(sObj.compid);

        um.getAllUsers({
            compid: sObj.compid
        }, function(err, users) {
            console.log(JSON.stringify(users));
            utils.render('users/search', {
                msg: 'hello',
                userlist: users
            })(req, res, next);
        });
    });
});


router.post('/supervisor/employees', function(req, res) {
    var sm = new sModule();
    var um = new userMoudle({db:sm.db});
    var userid = req.body.userid;
    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {
        um.searchUser(userid, sObj.compid, function(err, doc) {
            var title;
            if (err) {
                utils.render('users/search', {
                    'title': 'Search Error!'
                });
            } else {
                if (doc.length === 0) {
                    title = "No such userid";
                } else {
                    title = "Searching Results for " + userid;
                }
                utils.render('users/search', {
                    'search_term': userid,
                    'title': title,
                    'userlist': doc
                })(req, res);
            }
            sm.db.close();
        });
    });
});

router.get('/supervisor/employees/:id', function(req, res){
    var sm = new sModule();
    var um = new userMoudle({db: sm.db});

    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {

        // console.log(sObj.compid);
        // console.log(req.params.id);

        um.getUserInfo(req.params.id, function(err, user) {
            if(err){
                utils.render('users/search');
            }else{
                // console.log('This is the user being searched...');
                // console.log(user);

                if(user && user.address){
    				var addr = user.address.split('|');

    				user['address_street'] = addr[0];
    				user['address_city'] = addr[1];
    				user['address_state'] = addr[2];
    				user['address_zip'] = addr[3];
    			}

                utils.render('users/detail', {
                    userinfo: user
                })(req, res);
            }
        });
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

router.get('/testoverview', function(req, res, next){ 
    utils.render('overviewreport', {})(req, res, next);
});

router.get('/teststaffview', function(req, res, next){ 
    utils.render('staffreport', {})(req, res, next);
});

router.get('/testusermodify/:id', function(req, res, next){

    var um = new userMoudle();
    um.getUserInfo(req.params.id, function(err, doc){
        utils.render('modifyUser', { user: doc })(req, res, next);
    });
    
});

router.get('/message', utils.render('message', {
    msg: {
        head: 'Hello',
        body: "we are still testing although it is 7:20PM now!!"
    },
    success: false
}));

router.get('/testdb', function(req, res, next) {

    db.get('users').find({}, {}, function(err, docs) {

        res.render('message', {
            msg: {
                head: "TEST",
                body: 'Haha, Test Successfully! The docs count is ' + docs.length
            },
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
