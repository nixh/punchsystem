var express = require('express');
var router = express.Router();

var utils = require("../utils");

/* GET users listing. */
function addUser(req, res, next){
	var db = req.db;
	var col = db.get('users');

	var body = req.body;
	var userid = parseInt(body.userid);
	if(isNaN(userid))
		userid = body.userid;

	// var addr = body.
	col.insert(
		{
			"userid": userid,
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
				res.redirect('search');
			}
		}
	);
};

function getUsers(req, res, next){

	var db = req.db;
	var col = db.get('users');

	var body = req.body;

	var userid = parseInt(body.userid);
	if(isNaN(userid))
		userid = body.userid;

	console.log(userid);
	console.log(body);

	col.find(
		{"userid": userid
			// {
			// 	$regex: userid
			// }
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
};

function getAllUsers(req, res, next){
	var db = req.db;
	var col = db.get('users');

	col.find({}, {}, function(err, docs){
		if(err){
			utils.render('users/serach', {"title": "Loading Users Error!"})(req, res, next);
		}else{
			if(docs.length === 0){
				var title = "There is not even one user!";
			}else{
				var title = "All User List";
			}

			utils.render(
				'users/search',
				{
					"title": title,
					"userlist": docs
				}
			)(req, res, next);
		}
	});
};

function getUserInfo(req, res, next){
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
					"users/detail",
					{
						"userinfo": doc
					}
				)(req, res, next);
			}
		}
	);
}


function modUser(req, res, next){
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
				res.redirect('search');
			}
		}
	);
};

function delUser(req, res, next){

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
			res.redirect('search');
		}
	});
};

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

// Add a new user
router.get('/add', utils.render('users/adduser', {title: 'UserAdd'}));
router.post('/add', addUser);


// Display all users and search users
router.get('/search', getAllUsers);
router.post('/search', getUsers);

//Change the info of a specific user
router.get('/change/:id', getUserInfo);
router.post('/change', modUser);

router.post('/delete', delUser);

router.addUser = addUser;
router.getUsers = getUsers;
router.modUser = modUser;
router.delUser = delUser;

module.exports = router;


// router.get('/get', getUser);
