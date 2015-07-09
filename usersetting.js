var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
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
	},

	receiveemail : function(userobj,callback) {
		//vaildate(userobj);
		var collection=db.get("users");
	
		collection.findOne({'userid':userobj.userid}, {fields: { "email":1,"_id":0}} ,function(err,doc){
			console.log(doc.email);
		});
	},

	switchinformation : function(userobj,callback){
		//vaildate(userobj);
		var collection = db.get('users');
		collection.update({
			'userid':userobj.userid
			},
				{"$set":{
						'freqz':userobj.frequency,
						'switch':userobj.switchs
					}
				},callback)
	}		
};
