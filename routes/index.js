var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchtest');
var config = require("../config.json");
var btoa = require('btoa');
var nobi = require('nobi');
var crypto = require('crypto');
var signer = nobi(config.appKey);

var loginKeys = {};

function sha(text) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(text);
    return sha256.digest('hex');
}

function login(username, password, loginkey) {
    loginkey = unescape(loginkey);
    try {
        signer.unsign(loginKeys[loginkey]);
    } catch(e) {
        return { msg: 'error!', ok: false }
    }
    var userCol = db.get('users');
    var shapwd = sha(password);
    
}

function loginpage(req, res, next) {
    var timestamp = btoa(new Date().getTime()); 
    var signiture = signer.sign(timestamp);
    var parts = signiture.split('.');
    loginKeys[parts[1]] = signiture;
    console.log(JSON.stringify(loginKeys));
    res.render('login', {loginKey : parts[1] }); 
} 

function postLogin(req, res, next) {
    var obj = req.body;
    console.log(JSON.stringify(obj));
    var response = login(obj.userId, obj.password, obj.loginKey);
    res.render('', {msg: response.msg, success: response.ok})
}


/* GET home page. */
router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', { title: 'Express', ret: results });
});

router.post('/login', postLogin);

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


router.get('/login',loginpage);

module.exports = router;
