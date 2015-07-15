var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var email= require('./email');
var express = require('express');
var router = express.Router();
var db;

function vaildate(userobj){
	
	if(typeof userobj.userid !== 'string')
			userobj['userid'].toString();
	if(typeof userobj.oldpass !== 'string')
			userobj['oldpass'].toString();

	if(typeof userobj.newpass !== 'string')
			userobj['newpass'].toString();

	if(typeof userobj.confirmpass !== 'string')
			userobj['confirmpass'].toString();

}

function changepass(userobj,callback){
		//vaildate(userobj);
		var	db= this.db;
		var collection=db.get("users");
		if(userobj.newpass ===userobj.confirmpass){
			collection.findAndModify({
				'password':userobj.oldpass,
				'userid':userobj.userid
				},
					{"$set":{
						'password':userobj.newpass
						}
					},
				callback);
		}else 
		callback('');
	}
function receiveemail(userobj,callback) {
		var db= this.db;
		var collection=db.get("users");
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,callback);
	}

function updateemail(userobj,callback){
		var db= this.db;
		var collection=db.get("users");
		collection.findAndModify({
			'userid':userobj.userid
			},
				{"$set":{
						'freqz':userobj.timePeriod,
						'email':userobj.receiveEmails
					}},callback)
		
}

function enableEmail(userobj,callback){
		var db = this.db;
		var collection = db.get('users');
		//vaildate(userobj);
		collection.update({
			'userid':userobj.userid
			},
				{"$set":{
						'enableEmail':userobj.enableEmail,
						
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

function Module(settings) {
	_.extend(this, settings);
	if(!this.db) {
		this.db = monk(utils.getConfig('mongodbPath'));
	}
	if(!this.conf){
		this.conf = utils.getConfig('email.server');
	}
	if(!this.mailinfo){
		this.mailinfo ={
			cc: " ",
			csvStringForAttachments: ["name, punchintime, punchouttime\nQ,2015-10-10 08:00:00, 2015-10-10 19:00:00"],
			subject: "changepwd",
			html: "<p> Your password has been changed",
		}
	}
}

Module.prototype = {
	changepass : changepass,
	receiveemail : receiveemail,
	enableEmail : enableEmail,
	enablerate: enablerate,
	sendemail : sendemail,
	updateemail: updateemail,
	setrate: setrate
}

module.exports = Module 

//Module = new Module();
