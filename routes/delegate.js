var express = require('express');
var router = express.Router();

var getDelegate = function(req, res, next){
	var db = req.db;
	var col = db.get('delegation');
	
	var userid = "romanchelsea";
	var compid = "Amazon";
	var username = "Roman Wang";
	
	col.find(
		{
			"userid": userid
		},
		
		function(err, doc){
			if(err){
				res.send("Retrive fail");
			}else{
				res.json(doc);
			}
		}
	);
}; 

var addDelegate = function(req, res, next){
	var db = req.db;
	var col = db.get('delegation');
	
	var userid = "romanchelsea";
	var compid = "Amazon";
	var username = "Roman Wang";
	
	col.insert(
		{
			"userid": userid,
			"compid": compid,
			"name": username
		},
		
		function(err, doc){
			if(err){
				res.send("Insertion fail");
			}else{
				res.send("Insertion success");
			}
		}
	);
}; 

var modDelegate = function(req, res, next){
	var db = req.db;
	var col = db.get('delegation');
	
	var userid = "romanchelsea";
	var compid = "Microsoft";
	var username = "Xing Ming";
	
	col.update(
		{
			"userid": userid,
		},
		{
			"$set":
			{
				"name": username,
				"compid": compid
			}
		},
		
		function(err, doc){
			if(err){
				res.send("Modify fail");
			}else{
				res.send("Modify success");
			}
		}
	);
}; 

var delDelegate = function(req, res, next){
	var db = req.db;
	var col = db.get('delegation');
	
	var userid = "romanchelsea";
	var compid = "Amazon";
	var username = "Roman Wang";
	
	col.remove(
		{
			"userid": userid
		},
		
		function(err, doc){
			if(err){
				res.send("Remove fail");
			}else{
				res.send("Remove success");
			}
		}
	);
}; 

router.get('/insert', addDelegate);
router.get('/change', modDelegate);
router.get('/delete', delDelegate);
router.get('/get', getDelegate);

router.addDelegate = addDelegate;
router.delDelegate = delDelegate;
router.modDelegate = modDelegate;
router.getDelegate = getDelegate;

module.exports = router;
