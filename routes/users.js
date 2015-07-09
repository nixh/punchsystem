var express = require('express');
var router = express.Router();
var usermod = require('../usermodule');

var utils = require("../utils");

var usermod = require('../usermodule');

// Add a new user
router.get('/add', utils.render('users/adduser', {title: 'UserAdd'}));
router.post('/add', function(req, res){
	var col = req.db.get('users');
	var userObj = req.body;
	
	usermod.addUser(userObj, col, function(err, doc){
		if(err){
			res.send('Add user failed!');
		}else{
			res.redirect('search');
		}
	});
});


// Display all users and search users
router.get('/search', function(req, res){
	var col = req.db.get('users');

	usermod.getAllUsers(col, function(err, doc){
		if(err){
			utils.render('users/search', {'title': 'Loading Users Erro!'})(req, res);
		}else{
			if(doc.length === 0){
				var title = "There is not even one user!";
			}else{
				var title = "All User List";
			}
			
			utils.render('users/search', {'title': title, 'userlist': doc})(req, res);
		}
	});
	
});

router.post('/search', getUsers);

//Change the info of a specific user
router.get('/change/:id', getUserInfo);
router.post('/change', modUser);

//Delete user
router.post('/delete', delUser);

router.addUser = addUser;
router.getUsers = getUsers;
router.modUser = modUser;
router.delUser = delUser;

module.exports = router;





// Strip spaces of a string
// function trim(s){
// 	return (s || '').replace(/^\s+|\s+$/g, '');
// };
//
// //Add a user
// function addUser(req, res, next){
// 	var db = req.db;
// 	var col = db.get('users');
//
// 	var body = req.body;
// 	var userid = body.userid;
// 	// if(isNaN(userid))
// 	// 	userid = body.userid;
//
// 	var addr = trim(body.address_street) +"|" + trim(body.address_city) + "|" + trim(body.address_state) + "|" + trim(body.address_zip);
// 	console.log(addr);
//
// 	// var addr = body.
//
// 	console.log(body.createDate);
// 	col.insert(
// 		{
// 			"userid": userid,
// 			"password": body.pwd,
// 			"createDate": body.createDate,
// 			"name": body.name,
// 			"sex": !!parseInt(body.sex),
// 			"email": body.email,
// 			"address": addr,
// 			"tel": body.tel,
// 			"compid": body.compname,
// 			"curRate": body.rate,
// 			"remark": body.remark,
// 			"avatar": body.avatar,
// 			"owner": !!parseInt(body.owner)
// 		},
//
// 		function(err, doc){
// 			if(err){
// 				res.send("Failed to insert new user");
// 			}else{
// 				res.redirect('search');
// // 			}
// // 		}
// // 	);
// // };
//
// // Get the users searched
// function getUsers(req, res, next){
//
// 	var db = req.db;
//
// 	console.log(req.cookies.sessionid);
//
// 	var col = db.get('users');
//
// 	var body = req.body;
//
// 	var userid = body.userid;
// 	// if(isNaN(userid))
// 	// 	userid = body.userid;
//
// 	console.log(userid);
// 	console.log(req.body);
//
// 	col.find(
// 		{"userid":
// 			{
// 				$regex: userid
// 			}
// 		},
//
// 		{},
//
// 		function(err, docs){
// 			if(err){
// 				utils.render('users/search', {"title": "Search Error"})(req, res, next);
// 			}else{
//
// 				if(docs.length === 0){
// 					var title = "No such username";
// 				}else{
// 					var title = "Searching Results for " + userid;
// 				}
//
// 				console.log(docs);
// 				utils.render(
// 					'users/search',
// 					{
// 						"searth_term": userid,
// 						"title": title,
// 						"userlist": docs
// 					}
// 				)(req, res, next);
//
// 			}
// 		}
// 	);
// };
//
// // Get all usres for default search page
// function getAllUsers(req, res, next){
// 	var db = req.db;
// 	var col = db.get('users');
//
// 	col.find({}, {}, function(err, docs){
// 		if(err){
// 			utils.render('users/serach', {"title": "Loading Users Error!"})(req, res, next);
// 		}else{
// 			if(docs.length === 0){
// 				var title = "There is not even one user!";
// 			}else{
// 				var title = "All User List";
// 			}
//
// 			utils.render(
// 				'users/search',
// 				{
// 					"title": title,
// 					"userlist": docs
// 				}
// 			)(req, res, next);
// 		}
// 	});
// };
//
// // Get the info of the specified user
// function getUserInfo(req, res, next){
// 	var db = req.db;
// 	var col = db.get('users');
//
// 	var userid = req.params.id;
// 	console.log(userid);
//
// 	var userid = userid;
// 	// if(isNaN(userid)){
// 	// 	userid = req.params.id;
// 	// }
//
// 	col.findOne(
// 		{
// 			"userid": userid
// 		},
//
// 		function(err, doc){
// 			if(err){
// 				res.send("Failed to changed the user info");
// 				console.log(doc + "woca");
// 			}else{
//
// 				console.log(JSON.stringify(doc));
//
// 				if(doc && doc.address){
// 					var addr = doc.address.split("|");
//
// 					console.log(addr);
// 					doc['address_street'] = addr[0];
// 					doc['address_city'] = addr[1];
// 					doc['address_state'] = addr[2];
// 					doc['address_zip'] = addr[3];
// 				}
// 				// console.log(doc.address_zip);
// 				utils.render(
// 					"users/detail",
// 					{
// 						"userinfo": doc
// 					}
// 				)(req, res, next);
// 			}
// 		}
// 	);
// }
//
// // Modify a user
// function modUser(req, res, next){
// 	var db = req.db;
// 	var col = db.get('users');
// 	var body = req.body;
//
// 	console.log("Posting modify info");
// 	console.log(body);
//
// 	var _id = body._id;
// 	var userid = body.userid
// 	var username = body.name;
// 	var createDate = body.createDate;
// 	var sex = body.sex;
//
// 	var addr = trim(body.address_street) +"|" + trim(body.address_city) + "|" + trim(body.address_state) + "|" + trim(body.address_zip);
//
// 	var tel = body.tel;
// 	var password = body.pwd;
// 	var currentHourlyRate = body.curRate;
// 	var email = body.email;
// 	var compid = body.compname;
//
// 	var newid = body.userid;
// 	var newpath = "change/" + newid;
//
// 	col.update(
// 		{
// 			'_id': _id
// 		},
// 		{
// 			"$set":
// 			{
// 				"userid": userid,
// 				"name": username,
// 				"createDate": createDate,
// 				"password": password,
// 				"sex": !!parseInt(sex),
// 				"email": email,
// 				"address": addr,
// 				"compid": compid
// 			}
// 		},
// 		function(err, docs){
// 			if(err){
// 				res.end("Failed to update");
// 			}else{
// 				res.redirect(newpath);
// 			}
// 		}
// 	);
// };
//
//
// // Delete the user
// function delUser(req, res, next){
//
// 	var db = req.db;
// 	var col = db.get('users');
//
// 	var body = req.body;
//
// 	console.log(body._id);
//
// 	var _id = body._id;
//
//
// 	col.remove({"_id" : _id}, function(err, doc){
// 		if(err){
// 			res.send('Failed deleting');
// 		}else{
// 			res.redirect('search');
// 		}
// 	});
//
// };