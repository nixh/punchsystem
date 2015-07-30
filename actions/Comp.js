var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/compModule');
var s = new s();
var Q = require('q');
Comp = {};

//addcompview
Comp.addCompView ={
	type : 'jade',
	template : 'supadmin/add',
	execute: function(req,res,next) {
		return Q('{}');
	}
}
//add comp
Comp.addComp = {
	type : 'jade',
	template : 'supadmin/add',
	execute: function(req,res,next) {
		var compobj = req.body;
		var docs = s.addNewComp(compobj);
		return docs.then(function(doc){
			return doc;
		});
	}
}

//searchview:show curruent comp
Comp.searchCompView = {
	type : 'jade',
	template : 'supadmin/search',
	execute: function(req,res,next) {
		var docs = s.searchAllComp();
		return docs.then(function(doc) {
			return doc;
		});
	}
}

//searchOneComp
Comp.searchOneComp = {
	type : 'jade',
	template : 'supadmin/search',
	execute: function(req,res,next) {
		var compid = req.body.compid;
		compid = new Number(compid);
		var docs = s.searchOneComp(compid);
		return docs.then(function(doc){

		})
	}
}





module.exports = Comp;







