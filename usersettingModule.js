var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var email= require('./email');
var express = require('express');
var router = express.Router();
var db;

function vaildate(userobj){

}
function changepass(userobj,callback){
		var	db= this.db;
		var collection=db.get("users");
		collection.update({
			'password':userobj.oldpass,
			'userid':userobj.userid
			},
				{"$set":{
					'password':userobj.newpass
					}
				},
			callback);
	}
function receiveemail(userobj,callback) {
		var db= this.db;
		var collection=db.get("users");
		//vaildate(userobj);
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,callback);
	}

function switchinformation(userobj,callback){
		var db = this.db;
		var collection = db.get('users');
		//vaildate(userobj);
		collection.update({
			'userid':userobj.userid
			},
				{"$set":{
						'freqz':userobj.frequency,
						'switch':userobj.switchs
					}
				},callback)
	}		


function sendemail(userobj){
		var conf = this.conf;
		var db = this.db;
		var info =this.mailinfo
		var collection = db.get('users');
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,function(err,doc){
			if(err){
				console.log('undefine');
			}
			else{
				var to = doc.email;
				email(conf).sendEmail(to, info.cc, info.subject, info.html, info.csvStringForAttachments);
			}
		})
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
	switchinformation : switchinformation,
	sendemail : sendemail
}

module.exports = Module 

