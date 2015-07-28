
var _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');

var config = require('../common/config');
var Q = require('q');
var sid = require('./sessionModule');
var s = new sid();

dbm.setUrl('localhost/punchsystem');

function show(obj) {
	console.log(obj);
	return Q(obj);
}

function sha(str) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(str);
    return sha256.digest('hex');
}

function getUser(session) {
    return dbm.load('users', session.userid, 'userid').call(this);
}

function getSession(sessionid) {
    return dbm.load('session', sessionid, 'sessionid').call(this);
}

function changePwd(oldpass,newpass) {
	return function (user) {
		//oldpass = sha(oldpass);
		//newpass = sha(newpass);
		if (user.password === oldpass) {
			return dbm.updateOne('users', {
				'userid':user.userid,
				'password':oldpass
			}, {
				'$set': {
					'password':newpass
				}
			}).call(this);
		}
		else {
			return dbm.query('users', {
				'userid':user['userid'],
				'password':user['password']
			}).call(this);
		}
	}	
}




function receiveEmail(user) {
	return dbm.query('users', {
		'userid':user.userid
	}).call(this);
}

function updateemail(timePeriod,receiveEmails,enableEmail) {
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid}, {
				"$set": {
					'freqz':timePeriod,
					'email':receiveEmails,
					'enableEmail':enableEmail
				}
			}).call(this);
	}
}

function changeRate(newRate,overTime,enableRate){
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid}, {
				'$set': {
					'curRate':newRate,
					'overtime':overTime,
					'enablerate':enableRate
				}
			}).call(this);
	} 
}

function onoffEmail(enableEmail) {
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid
		}, {
			'$set': {
				'enableEmail':enableEmail
			}
		}).call(this);
	}
}

function onoffRate(enableRate) {
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid
		}, {
			'$set': {
				'enablerate':enableRate
			}
		}).call(this);
	}
}

//更改密码
function settings(oldpass,newpass,sessionid) {
	dbm.use(function() {return sessionid},show,getSession,getUser,changePwd(oldpass,newpass)).done();	
}

//更改邮箱
function settingEmail(timePeriod,receiveEmails,sessionid,enableEmail) {
	dbm.use(function() {return sessionid},getSession,getUser,updateemail(timePeriod,receiveEmails,enableEmail)).done();
}

//显示当前邮箱
function showEmail(sessionid) {
	return dbm.use(function(){return s.getUserBySessionId(sessionid)},receiveEmail);
}


//邮箱开关
function enableEmail(sessionid,enableEmail) {
	dbm.use(function() {return sessionid},getSession,getUser,onoffEmail(enableEmail)).done();
}

//工资开关
function enableRate(sessionid,enableRate) {
	dbm.use(function() {return sessionid},function(){return s.getUserBySessionId},onoffRate(enableRate)).done();
}
//工资更改
function setRate(sessionid,newRate,overTime,enableRate) {
	dbm.use(function() {return sessionid},s.getUserBySessionId,changeRate(newRate,overTime,enableRate)).done();
}

function Module() {
	
}

Module.prototype = {
	changepass : settings,
	settingEmail:settingEmail,
	showEmail:showEmail,
	enableEmail:enableEmail,
	enableRate:enableRate,
	setRate:setRate
}

module.exports = Module 

//Module = new Module();
