var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/usersettingModule')
settings.staffSettingView={
	type = 'jade',
	template = './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		var docs = s.showEmails(sessionid);
		docs.error(function(err) {
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

supSettings.supSettingView = {
	type = 'jade',
	template = './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		var docs = s.showEmails(sessionid);
		docs.error(function(err) {
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

supSettings.emailSwitch = {
	type = 'jade',
	template = './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		var switchs = parseInt(req.params.switchs);
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enableEmail(sessionid,switchs);
		docs.error(function(err) {
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

supSettings.rateSwitch = {
	type = 'jade',
	template = './staff/staff_setting_su',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		var switchs
		if(req.params.switchs == 1) {
			switchs = 0;
		}
		else {
			switchs = 1;
		}
		var docs = s.enablerate(sessionid,switchs);
		docs.error(function(err) {
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

settings.changePass = {
	type = 'jade',
	template = 'message',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		oldpass = res.oldpass;
		newrate = res.newpass;
		var docs = s.settings(oldpass,newpass,sessionid)
		docs.error(function(err) {
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

supSettings.changePass = {
	type = 'jade',
	template = 'message',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		oldpass = res.oldpass;
		newrate = res.newpass;
		var docs = s.settings(oldpass,newpass,sessionid)
		docs.error(function(err) {
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

supSettings.setrate = {
	type = 'jade',
	template = 'message',
	execute: function(req,res,next) {
		sessionid = res.coolies.sessionid;
		newRate = res.body.newrate;
		overTime = res.body.overtime;
		var docs.setRate(sessionid,newRate,overTime);
		docs.error(function(err){
			next(err)
		}).then()
	}

}
/*r
router.post('/supervisor/setrate',function (req,res){
	var userobj=req.body;
	console.log(userobj)
	settings.enablerate(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});
	settings.setrate(userobj,function (err,doc){
		if (err||!doc||doc.length==0){
			res.send('err');
		}else{
			//console.log(doc)
			res.render("./staff/staff_setting_su",
						{	"userid":userobj.userid,
							"receiveEmails":doc.email,
							"oldpassword":doc.password,
							"su":true,
							"enableEmail":userobj.enableEmail,
							"enablerate":userobj.enablerate,
							"overtime":userobj.overtime,
							"newrate":userobj.newrate
						});
		}
	})
});