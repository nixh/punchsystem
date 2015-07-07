var express = require('express');
var router = express.Router();

var utils = require("../utils");

/* GET users listing. */


var getUser = function(req, res, next){

	console.log(req.body);

	var db = req.db;
	var col = db.get('users');

	var body = req.body;

	col.find(
		{"userid": body.userid},

		function(err, doc){
			if(err){
				res.send("No such username");

			}else{
				res.json(doc);

				// res.render(
// 					"users/search",
//
// 					{
// 						'title': "Search Results",
// 						'userlist': doc
// 					}
// 				);
			}
		}
	);
};


var addUser = function(req, res, next) {
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

var modUser = function(req, res, next){

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

var delUser = function(req, res, next){

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

router.get('/search', utils.render('users/search', {"title": "Search a user"}));

router.post('/search', function(req, res, next){

	var db = req.db;
	var col = db.get('users');

	var body = req.body;

	var userid = parseInt(body.userid);
	if(isNaN(userid))
		userid = body.userid;
	console.log(userid);
	col.find(
		{"userid": userid},

		{},

		function(err, docs){
			if(err){
				utils.render('users/search', {"title": "Search Error"})(req, res, next);
			}else{

				if(docs.length === 0){
					var title = "No such username";
				}else{
					var title = "Searching Results";
				}

					console.log(docs);
					utils.render(
						'users/search',
						{
							"title": title,
							"userlist": docs
						}
					)(req, res, next);

			}
		}
	);
});

router.get('/change/:id', function(req, res, next){
	var db = req.db;
	var col = db.get('users');

	var userid = req.params.id;
	console.log(userid);

	col.find(
		{
			"userid": userid
		},
		{},
		function(err, doc){
			if(err){
				utils.render(
					'error',
					{
						"message": "Error changing user"
					}
				)(req, res, next);
			}else{

				var attr = {};

				if(doc.length === 0){
					attr.msg = "No such username";
				}else{
					attr.msg = "The user is available";
				}

				console.log(doc);

				utils.render(
					'users/search',
					{
						"title": title,
						"userlist": docs
					}
				)(req, res, next);

			}

		}
	)
});


router.get('/get', getUser);
router.get('/insert', addUser);
router.get('/change', modUser);
router.get('/delete', delUser);

router.addUser = addUser;
router.getUser = getUser;
router.modUser = modUser;
router.delUser = delUser;

module.exports = router;
