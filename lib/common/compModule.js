ar _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');
var config = require('../common/config');
var Q = require('q');

var db = new dbm('localhost:27017/aps');

function show(obj) {
	console.log(obj);
	return Q(obj);
}
//赋初值
function warp(value) {
	return function() {
		return value;
	};
}

function addComp(compobj) {
	return db.insert('comps', {
		'registerDate':compobj['reg_Date'],
		'compid':userobj['compid'],
		'name':userobj['comp_Name'],
		'expires':userobj['exp_Date']
	}).call(this);
}

function delComp(compid) {
	return db.deleteOne('comps', {
		'compid':compid
	}).call(this)
}
function searchComp(compid){
	return db.query('comps', {
		'compid':compid
	},{}).call(this)
}

function changeComp(compobj) {
	return db.updateOne('comps',{
		'compid':compobj['compid']
	}, {
		'$set': {
			'registerDate':compobj['reg_Date'],
			'name':compobj['comp_Name'],
			'expires':compobj[exp_Date]
		}
	}
	}).call(this)
}
//新建公司
function Add(compobj){
	db.use(warp(compobj),addComp,show).done();
}
//删除公司
function Del(compid) {
	db.use(warp(compid),delComp,show).done();
}
//查找指定公司
function Search(compid){
	db.use(warp(compid),searchComp,show).done()
}
//更改公司
function Change(compobj){
	db.use(warp(compobj),changeComp,show).done()
}
function Module() {
	
}

Module.prototype = {
	
}

module.exports = Module 