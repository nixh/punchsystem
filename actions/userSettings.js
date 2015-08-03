var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/usersettingModule');
var s = new s();
var Q = require('q');

userSettings ={};

userSettings.emailSwitch = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var userid = req.params.userid;
		var switchs = parseInt(req.params.switchs);
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableEmailById(sessionid,switchs);
		return docs.then(function (doc) {
			var data = {
				'status' : 'success'
			};
			return data;
		});
	}	
}

userSettings.changePass = {
	type : 'api',
	execute: function(req,res,next) {
		var userid = req.params.userid;
		var oldpass = req.body.oldpass;
		var newpass = req.body.newpass;
		var docs = s.changepassById(oldpass,newpass,sessionid)
		return docs.then(function (doc) {
			
			if(!doc) {
				var data = {
					'status': 'fail' 
				};
				return data;
			}
			else {
				var data = {
					'status': 'success'
				};
				return data;
			}
		});
	}
}

userSettings.sendEmail = {
	type : "api",
	execute: function(req,res,next) {
		var userid = req.params.userid;
		var cc = '';
		var subject = 'Rate report';
		var html = 'Rate report<i>this month </i>.';
		var csvStringForAttachments = req.body.csvStringForAttachments;
		var docs = s.sendEmail(sessionid,cc,subject,html,csvStringForAttachments);
		return docs.then(function(doc) {
			if(err){
				var data = {
					'status': 'fail',
					'err': ''
				}
				return data;
			}
			else {
				var data = {
					'status':'success',
					'msg': ''
				}
				return data;
			}
		});
	}
}

module.exports = userSettings;
