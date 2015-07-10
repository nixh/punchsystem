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


function addUser(userObj, col, callback){
	validate(userObj);

	var addr = trim(userObj.address_street) +"|" + trim(userObj.address_city) + "|" + trim(userObj.address_state) + "|" + trim(userObj.address_zip);

	userObj.address = addr;

	col.find({"userid": userObj.userid}, function(err, doc){
		if(err){
			res.send('Add user error!');
		}else{
			if(doc){
				throw "User not found"
			}
		}
	});

	col.insert(userObj, callback);
}

function searchUser(searchTerm, col, callback){
	col.find(
		{
			'userid': {$regex: searchTerm}
		},
		{},
		callback
	);
}

function getAllUsers(col, callback){
	col.find({}, {}, callback);
}

function getUserInfo(userid, col, callback){
	col.findOne(
		{
			'userid': userid
		},
		callback
	)
}

function changeUser(userObj, col, callback){
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
}

function deleteUser(_id, col, callback){
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

	db = this.db;
}

Module.prototype = {
	addUser: addUser,
	searchUser: searchUser,
	getAllUsers: getAllUsers,
	getUserInfo: getUserInfo,
	changeUser: changeUser,
	deleteUser: deleteUser
}

module.exports = Module
