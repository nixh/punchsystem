var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/usersettingModule');
var s = new s();
var Q = require('q');

Settings ={};

//用户页面
Settings.staffSettingView = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req, res, next) {
		var sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		return docs.then(function(doc) {
			var data = {
				'userid':doc.userid,
				'receiveEmails': doc.email,
				'su':false
			};
			return data;
		});
	}
};
//管理员页面
Settings.supSettingView = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		return docs.then(function(doc) {
			var data = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
			return data;
		});
	}
}

Settings.setEmailView = {
	type: 'jade',
	template: './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		return docs.then(function(doc) {
			var data = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
			return data;
		});
	}
}

Settings.setRateView = {
	type: 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		return docs.then(function(doc) {
			var data = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
			return data;
		});
	}
}
//邮箱开关
Settings.emailSwitch = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var switchs = parseInt(req.params.switchs);
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableEmail(sessionid,switchs);
		return docs.then(function (doc) {
			var data = {
				'userid':doc.userid,
				'su': true,
				'enableEmail':doc.enableEmail
			};
			return data;
		});
	}
}
//工资设置开关
Settings.rateSwitch = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var switchs
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableRate(sessionid,switchs);
		return docs.then(function (doc) {
			var data = {
				'userid':doc.userid,
				'su': true,
				'enableEmail':doc.enablerate
			};
			return data;
		});
	}
}

// 用户改密码
Settings.changePass = {
	type : 'jade',
	template : 'message',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var oldpass = req.body.oldpass;
		var newpass = req.body.newpass;
		var docs = s.changepass(oldpass,newpass,sessionid)
		return docs.then(function (doc) {

			if(!doc) {
				var data = {
					'success': false,
                	'msg': {head:res.__("changepass failed, maybe wrong password")},
                	'pageUrl': '/settings'
				};
				return data;
			}
			else {
				var data = {
					'success': true,
            		'msg': {head:res.__("changepass successful")},
            		'pageUrl': '/settings'
				};

				return data;

			}
		});
	}
}
//管理员改密码
Settings.supChangePass = {
	type : 'jade',
	template : 'message',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var oldpass = req.body.oldpass;
		var newpass = req.body.newpass;
		var docs = s.changepass(oldpass,newpass,sessionid)
		return docs.then(function (doc) {
			if(!doc) {
				var data = {
					'success': false,
                	'msg': {head:res.__('changepass failed, maybe wrong password')},
                	'pageUrl': '/supervisor/settings'
				};

				return data;
			}
			else {
				var data = {
					'success': true,
            		'msg': {head:res.__('changepass successful')},
            		'pageUrl': '/supervisor/settings'
				};

				return data;
			}
		});
	}
}
//设置工资
Settings.setRate = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var newRate = req.body.newrate;
		var overTime = req.body.overtime;
		var enableRate = req.body.enablerate;
		var docs = s.setRate(sessionid,newRate,overTime,enableRate);
		return docs.then(function(doc){
			var date = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"oldpassword":doc.password,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.newrate
			};
			return data;
		});
	}
}

Settings.setEmail = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var timePeriod = req.body.timePeriod;
		var receiveEmails = req.body.receiveEmails;
		var enableEmail = req.body.enableEmail;
		var docs = s.settingEmail(timePeriod,receiveEmails,sessionid,enableEmail);
		return docs.fail(function(err){
			next(err)
		}).then(function(doc){
			var data = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"oldpassword":doc.password,
				"newrate":doc.curRate
			};
			return data;
		})
	}
}

Settings.sendEmail = {
	type : "api",
	execute: function(req,res,next) {
		var sessionid = req.cookies.sessionid;
		var cc = req.body.cc;
		var subject = req.body.subject;
		var html = req.body.html;
		var csvStringForAttachments = req.body.csvStringForAttachments;
		var docs = s.sendEmail(sessionid,cc,subject,html,csvStringForAttachments);
		return docs.then(function(doc) {
			return doc;
		});
	}
}




module.exports = Settings;
