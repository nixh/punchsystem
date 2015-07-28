var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/usersettingModule')
var s = new s();
Settings ={};
//用户页面
Settings.staffSettingView={
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		docs.fail(function(err) {
			next(err)
		}).then(function(doc) {
			return data = {
				'userid':doc.userid,
				'receiveEmails': doc.email,
				'su':false
			};
		});
	}
}
//管理员页面
Settings.supSettingView = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		docs.fail(function(err) {
			next(err)
		}).then(function(doc) {
			return data = {
				"userid":userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
		});
	}
}

Settings.setEmailView = {
	type: 'jade',
	template: './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		docs.fail(function(err) {
			next(err)
		}).then(function(doc) {
			return data = {
				"userid":userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
		});
	}
}

Settings.setRateView = {
	type: 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var docs = s.showEmail(sessionid);
		docs.fail(function(err) {
			next(err)
		}).then(function(doc) {
			return data = {
				"userid":userid,
				"receiveEmails":doc.email,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.curRate
			};
		});
	}
}
//邮箱开关
Settings.emailSwitch = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var switchs = parseInt(req.params.switchs);
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableEmail(sessionid,switchs);
		docs.fail(function(err) {
			next(err)
		}).then(function (doc) {
			return data = {
				'userid':doc.userid,
				'su': true,
				'enableEmail':doc.enableEmail
			};
		});
	}	
}
//工资设置开关
Settings.rateSwitch = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		var switchs
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableRate(sessionid,switchs);
		docs.fail(function(err) {
			next(err)
		}).then(function (doc) {
			return data = {
				'userid':doc.userid,
				'su': true,
				'enableEmail':doc.enablerate
			};
		});
	}
}

// 用户改密码
Settings.changePass = {
	type : 'jade',
	template : 'message',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		oldpass = req.oldpass;
		newrate = req.newpass;
		var docs = s.changepass(oldpass,newpass,sessionid)
		docs.fail(function(err) {
			next(err)
		}).then(function (doc) {
			if(!doc) {
				return data = {
					'success': false,
                	'msg': {head:res.__("changepass failed, maybe wrong password")},
                	'pageUrl': '/settings'
				};
			}
			else {
				return data = {
					'success': true,
            		'msg': {head:res.__("changepass successful")},
            		'pageUrl': '/settings'
				};
			}
		});
	}
}
//管理员改密码
Settings.supChangePass = {
	type : 'jade',
	template : 'message',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		oldpass = req.oldpass;
		newrate = req.newpass;
		var docs = s.changepass(oldpass,newpass,sessionid)
		docs.fail(function(err) {
			next(err)
		}).then(function (doc) {
			if(!doc) {
				return data = {
					'success': false,
                	'msg': {head:res.__("changepass failed, maybe wrong password")},
                	'pageUrl': '/supervisor/settings'
				};
			}
			else {
				return data = {
					'success': true,
            		'msg': {head:res.__("changepass successful")},
            		'pageUrl': '/supervisor/settings'
				};
			}
		});
	}
}
//设置工资
Settings.setRate = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		newRate = req.body.newrate;
		overTime = req.body.overtime;
		enableRate = req.body.enablerate;
		var docs = s.setRate(sessionid,newRate,overTime,enableRate);
		docs.fail(function(err){
			next(err)
		}).then(function(doc){
			return date = {
				"userid":doc.userid,
				"receiveEmails":doc.email,
				"oldpassword":doc.password,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.newrate
			};	
		});
	}
}

Settings.setEmail = {
	type : 'jade',
	template : './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = req.cookies.sessionid;
		timePeriod = req.body.timePeriod;
		receiveEmails = req.body.receiveEmails;
		enableEmail = req.body.enableEmail;
		var docs = s.settingEmail(timePeriod,receiveEmails,sessionid,enableEmail);
		docs.fail(function(err){
			next(err)
		}).then(function(doc){
			return data = {
				"userid":doc.userid,
				"receiveEmails":doc.receiveEmails,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"oldpassword":doc.password,
				"newrate":doc.curRate
			};
		})
	}
}





module.exports = Settings;
