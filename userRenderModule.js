var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();
var utils = require('../utils');
var session = require('../sessionModule');
var sid = new session();

function settingView() {
	return function (req, res) {
		var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function (err,doc,next) {
			if (err) {
				next(err);
			}else {
				userid = doc.userid;
				userobj = {"userid":userid};
				settings.receiveemail(userobj,function (err,doc,next) {
					if(err){
						next(err);
					}else{
						utils.render('./staff/staff_setting_su',
							{"userid":userid,"receiveEmails":doc.email,"su":false})(req, res, next);
					}
				})
			}
		})
	});
}

function Module(settings) {
	_.extend(this, settings);
	if(!this.db) {
		this.db = monk(utils.getConfig('mongodbPath'));
	}
}


Module.prototype = {
	staffView: settingView,
	superView: superView
}

module.exports = Module 