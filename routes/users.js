var express = require('express');
var router = express.Router();

/* GET users listing. */
var getUser = function(req, res, next){
	var db = req.db;
	var col = db.get('users');
	
	var userid = "romanchelsea";
	
	col.find({"userid": userid}, function(err, doc){
		if(err){
			res.send("Retrive fail");
		}else{
			res.json(doc);
		}
	});
}; 

var insertUser = function(req, res, next) {
	var db = req.db;
	var col = db.get('users');
	
	var userid = "romanchelsea";
	var username = "Roman Wang";
	var createDate = new Date().getTime();
	var sex = "male";
	var addr = "1648 80TH ST, Brooklyn, NY";
	var tel = "9178035096";
	var password = '12345678';
	var currentHourlyRate = "8.75";
	var email = "romanwang888@gmail.com";
	
	col.insert({
		"userid": userid,
		"name": username,
		"createDate": createDate,
		"password": password,
		"sex": sex,
		"email": email,
		"address": addr,
		"tel": tel,
		"curRate": currentHourlyRate
	}, function(err, doc){
		if(err){
			res.send("Insertion fail");
		}else{
			res.send("Insertion success");
		}
	});
};

var changeUser = function(req, res, next){
	
	var db = req.db;
	var col = db.get('users');
	
	var userid = "romanchelsea";
	var username = "Xing Ming";
	var createDate = new Date().getTime();
	var sex = "female";
	var addr = "1648 80TH ST, Brooklyn, NY";
	var tel = "4806035416";
	var password = '12345678';
	var currentHourlyRate = "8.75";
	
	col.update(
		{
			'userid': userid
		},
		{
			"$set":
			{
				"name": username,
				"sex": sex
			}
		},
		function(err, docs){
			if(err){
				res.end("Failed to update");
			}else{
				res.end("Succuess modify");
			}
		}
	);
};
		
var deleteUser = function(req, res, next){
	
	var db = req.db;
	var col = db.get('users');
	
	var userid = "romanchelsea";
	var username = "Roman Wang";
	var createDate = new Date().getTime();
	var sex = "male";
	var addr = "1648 80TH ST, Brooklyn, NY";
	var tel = "9178035096";
	var currentHourlyRate = "8.75";
	
	col.remove({"userid" : userid}, function(err, doc){
		if(err){
			res.send('Failed deleting');
		}else{
			res.send('Successfully deleted');
		}
	});
};		
	
router.get('/get', getUser);
router.get('/insert', insertUser);	
router.get('/change', changeUser);	
router.get('/delete', deleteUser);

router.insertUser = insertUser;
router.getUser = getUser;
router.changeUser = changeUser;
router.deleteUser = deleteUser;

module.exports = router;
