var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var s = require('../lib/module/compModule');
var s = new s();
var Q = require('q');
Comp = {};

//addcompview
Comp.addCompView ={
	type : 'jade',
	template : 'supadmin_add',
	execute: function(req,res,next) {
		return Q('{}');
	}
}
//add comp
Comp.addComp = {
	type : 'jade',
	template : 'supadmin_add',
	execute: function(req,res,next) {
		var compobj = req.body;
		var docs = s.addNewComp(compobj);
		return docs.then(function(doc) {
			return doc;
		});
	}
}

//searchview:show curruent comp
Comp.searchCompView = {
	type : 'jade',
	template : 'supadmin_search',
	execute: function(req,res,next) {
		var docs = s.searchAllComp();
		return docs.then(function(doc) {
			var data = {
				'comp':doc
			};
			return data;
		});
	}
}

//searchOneComp
Comp.searchOneComp = {
	type : 'jade',
	template : 'supadmin_search',
	execute: function(req,res,next) {
		var compid = parseInt(req.body.compid);
		var docs = s.searchOneComp(compid);
		return docs.then(function(doc) {
			return doc;
		});
	}
}

//searchusers
Comp.searchUserById = {
	type : 'jade',
	template : 'supadmin_users',
	execute: function(req,res,next) {
		var compid = parseInt(req.params.compid);
		var docs = s.searchUserByCompId(compid);
		return doc.then(function(doc) {
			var data = {
				'user': doc
			};
			return data;
		});
	}
}

//delComp
Comp.delCompById = {
	type : 'redirect',
	execute: function(req,res,next) {
		var compid = parseInt(res.params.compid);
		var docs = s.delByCompId(compid);
		return docs.then(function(){
			return "/supadmin/search";
		});
	}
}

//ChangeComp
Comp.changeCompById = {
	type : 'jade',
	template : 'supadmin_comp',
	execute: function(req,res,next) {
		var compid = parseInt(res.params.compid);
		var data = req.body;
		var docs = s.changeByCompId(compid,data);
		return docs.then(function(doc){
			return doc;
		});
	}
}
//changeCompView
Comp.changeView = {
	type : 'jade',
	template : 'supadmin_comp',
	execute: function(req,res,next) {
		var compid = parseInt(res.params.compid);
		var docs = s.searchOneComp(compid);
		return docs.then(function(doc){
			return doc;
		});
	}

}

module.exports = Comp;







