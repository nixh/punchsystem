
var _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');
var utils = require('../common/utils');
var config = require('../common/config');
var Q = require('q');
var sid = require('./sessionModule');
var m = new sid();
var wrap =utils.wrap;
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



function changePwd(oldpass,newpass) {
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid,
			'password':oldpass
		}, {
			'$set': {
				'password':newpass
			}
		}).call(this);
	}	
}




function receiveEmail(user) {
	return dbm.load('users', 
		user.userid,
		'userid'
	).call(this);
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
	return dbm.use(m.getUserBySessionId(sessionid),changePwd(oldpass,newpass));	
}

//更改邮箱
function settingEmail(timePeriod,receiveEmails,sessionid,enableEmail) {
	return dbm.use(m.getUserBySessionId(sessionid),updateemail(timePeriod,receiveEmails,enableEmail));
}

//显示当前邮箱
function showEmail(sessionid) {
	return dbm.use(m.getUserBySessionId(sessionid),receiveEmail);
}


//邮箱开关
function enableEmail(sessionid,enableEmail) {
	return dbm.use(m.getUserBySessionId(sessionid),onoffEmail(enableEmail));
}

//工资开关
function enableRate(sessionid,enableRate) {
	return dbm.use(m.getUserBySessionId(sessionid),onoffRate(enableRate));
}
//工资更改
function setRate(sessionid,newRate,overTime,enableRate) {
	return dbm.use(m.getUserBySessionId(sessionid),changeRate(newRate,overTime,enableRate));
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

module.exports = Module ;
// var s = new Module();
// s.changepass("111",'123','f39efc70-3629-11e5-a55f-9be434ab7853')
// Module = new Module();
