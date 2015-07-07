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
		{"userid": "romanchelsea"},

		function(err, doc){
			if(err){
				res.send("No such username");

			}else{
				res.json(doc);
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
	var body = req.body;

	console.log("Posting modify info");
	console.log(body);

	var _id = body._id;
	var userid = body.userid
	var username = body.name;
	var createDate = body.createDate;
	var sex = body.sex;
	var addr = body.address;
	var tel = body.tel;
	var password = body.pwd;
	var currentHourlyRate = body.curRate;
	var email = body.email;
	var compid = body.compname;

	col.update(
		{
			'_id': _id
		},
		{
			"$set":
			{
				"userid": userid,
				"name": username,
				"createDate": createDate,
				"password": password,
				"sex": !!parseInt(sex),
				"email": email,
				"address": addr,
				"compid": compid
			}
		},
		function(err, docs){
			if(err){
				res.end("Failed to update");
			}else{
				var path = "change/" + userid;
				res.redirect(path);
			}
		}
	);
};

var delUser = function(req, res, next){

	var db = req.db;
	var col = db.get('users');

	var body = req.body;

	var userid = body.userid;
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

	console.log(body);

	col.find(
		{"userid":
			{
				$regex: userid
			}
		},

		{},

		function(err, docs){
			if(err){
				utils.render('users/search', {"title": "Search Error"})(req, res, next);
			}else{

				if(docs.length === 0){
					var title = "No such username";
				}else{
					var title = "Searching Results for " + userid;
				}

					console.log(docs);
					utils.render(
						'users/search',
						{
							"searth_term": userid,
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

	var userid = parseInt(userid);
	if(isNaN(userid)){
		userid = req.params.id;
	}


	col.findOne(
		{
			"userid": userid
		},

		function(err, doc){
			if(err){
				res.send("Failed to changed the user info");
				console.log(doc + "woca");
			}else{

				console.log(JSON.stringify(doc));

				utils.render(
					"users/changeUser",
					{
						"userinfo": doc
					}
				)(req, res, next);
			}
		}
	);
});

router.get('/add', utils.render('users/adduser', {title: 'UserAdd'}));

router.post('/add', function(req, res, next){
	console.log(doc);

	utils.render(
		'users/search',
		{
			"title": title,
			"userlist": docs
		}
	)(req, res, next);

	var db = req.db;
	var col = db.get('users');

	var body = req.body;

	col.insert(
		{
			"userid": body.userid,
			"password": body.pwd,
			"name": body.name,
			"sex": !!parseInt(body.sex),
			"email": body.email,
			"tel": body.tel,
			"compid": body.compname,
			"curRate": body.rate,
			"remark": body.remark,
		},

		function(err, doc){
			if(err){
				res.send("Failed to insert new user");
			}else{
				res.render(
					'users/adduser',
					{
						title: 'UserAdd',
						tr: res.__,
						attr:
						{
							msg: 'insert success'
						}
					}
				);
			}
		}
	);

});

router.get('/get', getUser);
router.get('/insert', addUser);
router.post('/change', modUser);
router.post('/delete', delUser);

router.addUser = addUser;
router.getUser = getUser;
router.modUser = modUser;
router.delUser = delUser;

module.exports = router;
