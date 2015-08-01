var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var wrap = utils.wrap;
var db = require('../common/db');
var config = require('../common/config');
var Q = require('q');

var factory = require('./moduleFactory')();

db.setUrl('localhost/aps');

var s = factory.get('sessionModule');

function show(obj) {
	console.log(obj);
	return Q(obj);
}

function addComp(compobj) {
	return function(comp){
		if (!comp||comp.length ==0) {
			return db.insert('comps',compobj).call(this);
		}
		else {
			return db.update('comps', {
				'compid':compobj.compid
			}, {
				'$set':compobj
			}).call(this);
		}
	}
}

function delComp(compid) {
	return db.deleteOne('comps', {
		'compid':compid
	}).call(this)
}

function searchComp(compid){
	return db.load('comps',compid,'compid').call(this);
}
function searchAll(compid){
	return db.query('comps', {}).call(this);
}


function changeComp(data) {
	return function(compid) {
		return db.updateOne('comps', {
		'compid':compid
		}, {
			'$set': {
				'registerDate':data['reg_Date'],
				'name':data['comp_Name'],
				'expires':data['exp_Date']
			}
		}).call(this)
	}
}

function searchUser(comp) {
	return db.query('users', {
		'compid':comp.compid
	}).call(this);
}

//新建公司
function addNewComp(compobj){
	return db.use(wrap(compobj.compid),searchComp,addComp(compobj));
}
//删除公司
function delByCompId(compid) {
	return db.use(wrap(compid),delComp);
}
//查找指定公司
function searchOneComp(compid){
	return db.use(wrap(compid),searchComp);
}
//显示公司列表
function searchAllComp(compid) {
	return db.use(wrap(compid),searchAll)
}
//查找所属员工
function searchUserByCompId(compid) {
	return db.use(wrap(compid),searchComp,show,searchUser)
}
//更改公司
function changeByCompId(compid,data){
	return db.use(wrap(compid),changeComp(data))
}
function CompModule() {
	
}

// CompModule.prototype._private = {

// }

CompModule.prototype = {
	addNewComp: addNewComp,
	delByCompId: delByCompId,
	searchOneComp: searchOneComp,
	searchAllComp : searchAllComp,
	searchUserByCompId: searchUserByCompId,
	changeByCompId: changeByCompId,
}

// CompModule.prototype.func = function(){
// 	this._private.
// }

module.exports = CompModule; 

var text = new CompModule();
// text.Add({'reg_Date':'2017_123_12','compid':'101','comp_Name':'abc','exp_Date':'2019_123_12'}).then(function(doc){
// 	console.log(doc);
// })
// text.searchOneComp(1).then(function(doc){
// 	console.log(doc);
// })
// text.changeByCompId(1,{'reg_Date':'2017_123_12','compid':'101','comp_Name':'abc','exp_Date':'2019_123_12'}).then(function(doc){
// 	console.log(doc);
// })
// text.searchUserByCompId(1).then(function(doc){
// 	console.log(doc);
// })
// text.delByCompId('100').then(function(doc){
// 	console.log(doc);
// })









