var _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');
var config = require('../common/config');
var Q = require('q');

function show(obj) {
	console.log(obj);
	return Q(obj);
}

function sha(str) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(str);
    return sha256.digest('hex');
}

function getUser(sessionid) {
	var sid = require('./sessionModule');
	var s = new sid();
	return s.getUserBySessionId(sessionid);
}


function changePwd(oldpass,newpass) {
	return function (user) {
		oldpass = sha(oldpass);
		newpass = sha(newpass);
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

function updateemail(timePeriod,receiveEmails) {
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid}, {
				"$set": {
					'freqz':timePeriod,
					'email':receiveEmails
				}
			}).call(this);
	}
}

function changeRate(newRate,overTime){
	return function (user) {
		return dbm.updateOne('users', {
			'userid':user.userid}, {
				'$set': {
					'curRate':newRate,
					'overtime':overTime
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
	dbm.use(function() {return sessionid},getUser,show,changePwd(oldpass,newpass),show).done();	
}

//显示当前邮箱
function settingEmail(timePeriod,receiveEmails,sessionid) {
	dbm.use(function() {return sessionid},getUser,updateemail(timePeriod,receiveEmails),show).done();
}

//更改邮箱
function showEmail(sessionid) {
	dbm.use(function() {return sessionid},getUser,receiveEmail,show).done();
}


//邮箱开关
function enableEmail(sessionid,enableEmail) {
	dbm.use(function() {return sessionid},getUser,onoffEmail(enableEmail),show).done();
}

//工资开关
function enableRate(sessionid,enableRate) {
	dbm.use(function() {return sessionid},getUser,onoffRate(enableRate),show).done();
}
//工资更改
function setRate(sessionid,newRate,overTime) {
	dbm.use(function() {return sessionid},getUser,changeRate(newRate,overTime),show).done();
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
