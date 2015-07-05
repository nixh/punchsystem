var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var config = require("../config.json");
var btoa = require('btoa');
var nobi = require('nobi');
var crypto = require('crypto');
var signer = nobi(config.appKey);
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
    } catch(e) {
        return { msg: 'error! loginKey is ' + loginkey, ok: false };
    }
    var userCol = db.get('users');
    var shapwd = sha(loginObj.password);
    shapwd = loginObj.password;

    userCol.findOne({userid: parseInt(loginObj.userId), password: shapwd},{}, cb);
}

function loginpage(req, res, next) {
    var timestamp = btoa(new Date().getTime()); 
    var signiture = signer.sign(timestamp);
    var parts = signiture.split('.');
    loginKeys[parts[1]] = signiture;
    res.render('login', {loginKey : parts[1] }); 
} 

function postLogin(req, res, next) {
    var ret = login(req.body, function(err, doc){
        if(err)
            return res.render('message', {msg: err, success: false});
        if(!doc)
            return res.render('message', {msg: 'username or password error!', success: false});

        var sessionObj = {
            sessionid : uuid.v1(),
            userid : doc.userid,
            name : doc.name,
            compid : doc.compid,
            ip : req.ip 
        } 

        var session = db.get('session');
        session.insert(sessionObj, function(err, doc){
            if(err)
                throw err;
            res.cookie('sessionid', sessionObj.sessionid, {maxAge: 24*3600*1000, httpOnly: true});
            res.render('message', { msg: 'user has logined', success: true});
        });
        
    });
    if(ret)
        res.render('message', ret);
}

/* GET home page. */
/*
router.get('/', function(req, res) {
	res.render('index', {title: 'Hello World!'});
})
router.get('/company/post', function(req, res) {
	res.render('secret');
})
router.get('/company/delete', function(req, res) {
	res.render('delete');
})
router.get('/company/userlist', function(req, res) {
  	var db=req.db;
	var collection=db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist',{
			"userlist":docs
		});
    });
*/
router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', { title: 'Express', ret: results });
});

router.get('/login',loginpage);
router.post('/login', postLogin);

router.get('/testdb', function(req, res, next){
    
    db.get('users').find({}, {}, function(err, docs){

        res.render('message', { msg: 'Haha, Test Successfully! The docs count is ' + docs.length , success: true });
    });

});

router.get('/cookies', function(req, res, next){

    var cookies = req.cookies;
    var cookie_str = "";
    for(var key in cookies) {
        cookie_str += key + "=" + cookies[key] + ";<br/>";
    }
    res.cookie('name', 'Test Name_'+Math.random(), {maxAge: 90000, httpOnly: true});
    res.end(cookie_str);

});


router.get('/test', function(req, res, next){
	
    res.render('test/prac', { name:"Yong D Liu"});
});

router.get('/staff_main', function(req, res, next){
	
    res.render('staff/staff_main', {
            users: {
                    company_userid : "company_userid",
                    name : "name",
                    createDate: "Date",
                    password: "password", // Encrypted Text
                    sex : true,
                    email : 1231425
            }
    });
});

router.get('/staff_setting', function(req, res, next){
	
    res.render('staff/staff_setting', {emailReportData:['one', 'two', 'three']});
});

module.exports = router;
