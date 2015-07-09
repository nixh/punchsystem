var utils = require('./utils');
var _= require('underscore');
var monk = require('monk');
var express = require('express');
var router = express.Router();
var db;

function trim(s){
	return (s || '').replace(/^\s+|\s+$/g, '');
};

function validate(userObj){
	if(userObj === null){
		 userObj = {};
	}

	var userProp = ['_id', 'userid', 'password', 'createDate', 'name', 'sex', 'email', 'address', 'address_street', 'address_city', 'address_state', 'address_zip', 'tel', 'compid', 'curRate', 'remark', 'avatar', 'owner'];

	for(var a in userObj){
		if(userProp.indexOf(a) < 0){
			delete userObj[a];
		}
	}

	if(typeof userObj['sex'] !== "boolean"){
		userObj['sex'] = !!parseInt(userObj['sex']);
	}

	if(typeof userObj['owner'] !== "boolean"){
		userObj['owner'] = !!parseInt(userObj['owner']);
	}

	if(typeof userObj['curRate'] !== 'number'){
		userObj['curRate'] = Number(userObj['curRate']);
	}

	if(typeof userObj['compid'] !== 'number'){
		userObj['compid'] = Number(userObj['compid']);
	}
};

addUser: function(userObj, col, callback){
	validate(userObj);

	var addr = trim(userObj.address_street) +"|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);

	var p = col.find({"userid": userObj.userid});
	console.log(p);

	userObj.address = addr;

	col.insert(userObj, callback);
},


searchUser: function(searchTerm, col, callback){
	col.find(
		{
			'userid': {$regex: searchTerm}
		},
		{},
		callback
	);
},

getAllUsers: function(col, callback){
	col.find({}, {}, callback);
},

getUserInfo: function(userid, col, callback){
	col.findOne(
		{
			'userid': userid
		},
		callback
	)
},

changeUser: function(userObj, col, callback){
	validate(userObj);

	console.log(userObj);

	var _id = userObj._id;

	userObj.addr = trim(userObj.address_street) +"|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);

	col.update(
		{
			'_id': _id
		},
		{
			'$set':
			{
				'userid': userObj.userid,
				'name': userObj.name,
				'createDate': userObj.createDate,
				'password': userObj.password,
				'sex': !!parseInt(userObj.sex),
				'email': userObj.email,
				'address': userObj.addr,
				'compid': userObj.compid,
				'tel': userObj.tel,
				'curRate': userObj.curRate,
				'owner': userObj.owner,
				'remark': userObj.remark,
				'avatar': userObj.avatar
			}
		},
		callback
	);
},

deleteUser: function(_id, col, callback){
	col.remove(
		{
			"_id": _id
		},
		callback
	)
}

function Module(settings){
	_.extend(this, settings);
	if(!this.db){
		this.db = monk(utils.getConfig('mongodbPath'));
	}
}

