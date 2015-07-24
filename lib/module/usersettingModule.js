var _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');
var config = require('../common/config');
var Q = require('q');

function show(obj) {
	console.log(obj);
	return Q(obj);
}


function getUser(sessionid) {
	var sid = require('./sessionModule');
	var s = new sid();
	return s.getUserBySessionId(sessionid);
}


function changePwd(oldpass,newpass) {
	return function(user) {
		if (user.password === oldpass)
			return dbm.updateOne('users',
				{'userid':user.userid,'password':oldpass},
				{'$set':{'password':newpass}}).call(this);
		else 
			return dbm.query('users',{'userid':user[userid]}).call(this);
	}
}
//更改密码
function settings(oldpass,newpass,sessionid) {
	dbm.use(function(){return sessionid},getUser,show,changePwd(oldpass,newpass),show).done();	
}



function receiveEmail(user) {
	return dbm.query('users',{'userid':user.userid}).call(this);
}

function updateemail(timePeriod,receiveEmails,sessionid) {
	return function(user) {
		return dbm.updateOne('users', {'userid':user.userid},
				{"$set": {'freqz':timePeriod,
						'email':receiveEmails}}).call(this);
	}
}

//显示当前邮箱
function settingEmail(timePeriod,receiveEmails,sessionid) {
	dbm.use(function() {return sessionid},getUser,updateemail(timePeriod,receiveEmails),show);
}
//更改邮箱
function showEmail(sessionid) {
	dbm.use(function(){return sessionid},getUser,receiveEmail,show);
}


//邮箱开关
function enableEmail(sessionid) {
	dbm.use(function(){return sessionid},getUser,)
}
/*
function enableEmail(userobj,callback){
		var db = this.db;
		var collection = db.get('users');
		//vaildate(userobj);
		collection.update({
			'userid':userobj.userid
			},
				{"$set":{
						'enableEmail':userobj.enableEmail
						
					}
				},callback)
	}		

function enablerate(userobj,callback){
		var db = this.db;
		var collection = db.get('users');
		//vaildate(userobj);
		collection.update({
			'userid':userobj.userid
			},
				{"$set":{
						'enablerate':userobj.enablerate
					}
				},callback)
	}		

function sendemail(userobj){
		var conf = this.conf;
		var db = this.db;
		var info =this.mailinfo;
		var collection = db.get('users');
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,function(err,doc){
			if(err){
				console.log('undefine');
			}
			else if(!doc || doc.length === 0||userobj.enableEmail!=="0"){
				var to = " ";
			}
			else{
				var to = doc.email;
				email(conf).sendEmail(to, info.cc, info.subject, info.html, info.csvStringForAttachments);
				
			}
		})
}

function setrate(userobj,callback){
	var db = this.db;
	var collection = db.get("users");
	collection.findAndModify(
		{"userid":userobj.userid},
		{$set:
			{"curRate":userobj.newrate,
			"overtime":userobj.overtime}
		},callback);
}
*/
function Module() {
	
}

Module.prototype = {
	changepass : settings,
	settingEmail:settingEmail,
	showEmail:showEmail
	
}

module.exports = Module 

//Module = new Module();
