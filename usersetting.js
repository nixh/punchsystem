var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
<<<<<<< HEAD
var express = require('express');
var router = express.Router();
var email= require('./email');
var db =monk(utils.getConfig('mongodbPath'));
/*function vaildate(userobj){
	if(typeof userobj.userid !== 'string')
			userobj.userid.toString();
	if(typeof userobj.oldpass !== 'string')
			userobj.oldpass.toString();

	if(typeof userobj.newpass !== 'string')
			userobj.newpass.toString();

	if(typeof userobj.freqz !== 'number')
			userobj.freqz= parseInt(userobj.freqz);
			
	if(typeof userobj.switchs !== 'number')
			userobj.switchs= parseInt(userobj.switchs);
					
	};*/

module.exports = { 
	changepass : function(userobj,callback){
		//vaildate(userobj);
=======
var mongoUrl = "mongodb://127.0.0.1:27017/punchsystem";
var email = require("emailjs/email");

module.exports = {
	changepass : function(userid, oldpass,newpass,callback){
		var db=monk(mongoUrl);
>>>>>>> dev
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
<<<<<<< HEAD
	},

	receiveemail : function(userobj,callback) {
		//vaildate(userobj);
		var collection=db.get("users");
	
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,function(err,doc){
			console.log(doc.email);
		});
=======

		
		//updatepassword(userid, oldpass,newpass, callback);

	},

	receiveemail : function(userid,callback) {

		var db=monk(mongoUrl);

		var collection=db.get("users");

		collection.findOne({'userid':userid}, {fields: { "email":1,"_id":0}} ,

						callback);


	},

	enablesendemail : function(userid,frequency,callback){
		var db = monk(mongoUrl);
		var collection = db.get("users");

		var usermail = collection.findOne({'userid':userid},{fields:{'email':1,"_id":0}});

		sendmail(usermail);

>>>>>>> dev
	},

	switchinformation : function(userobj,callback){
		//vaildate(userobj);
		var collection = db.get('users');
		collection.update({
			'userid':userobj.userid
			},
<<<<<<< HEAD
				{"$set":{
						'freqz':userobj.frequency,
						'switch':userobj.switchs
					}
				},callback)
	}		
=======
				{
					"$set":{"location":
							{
								"longitude":longitude,
								"altitude":altitude,
								"heading":heading

							}
						}
				},
		callback
		)

	}*/



>>>>>>> dev
};
