var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var wrap = utils.wrap;
var db = require('../common/db');
var config = require('../common/config');
var Q = require('q');
db.setUrl('localhost/aps');


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
			return db.query('comps',compobj).call(this);
		}
	}
}

function del(compid) {
	return db.deleteOne('comps', {
		'compid':compid
	}).call(this)
}
function searchComp(compobj){
	return db.query('comps', {
		'compid':compobj['compid']
	}).call(this);
}

function change(compobj) {
	return db.updateOne('comps',{
		'compid':compobj['compid']
	}, {
		'$set': {
			'registerDate':compobj['reg_Date'],
			'name':compobj['comp_Name'],
			'expires':compobj[exp_Date]
		}
	}).call(this)
}


//新建公司
function Add(compobj){
	return db.use(wrap(compobj),searchComp,addComp(compobj));
}
//删除公司
function Del(compid) {
	db.use(wrap(compid),delComp,show).done();
}
//查找指定公司
function Search(compid){
	db.use(wrap(compid),searchComp,show).done()
}
//更改公司
function Change(compobj){
	db.use(wrap(compobj),changeComp,show).done()
}
function Module() {
	
}

Module.prototype = {
	Add:Add
}

module.exports = Module 

var text = new Module();
text.Add({'reg_Date':'2017_123_12','compid':'101','comp_Name':'abc','exp_Date':'2019_123_12'}).then(function(doc){
	console.log(doc);
})
