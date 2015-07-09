var express = require('express');
var router = express.Router();
var usermod = require('../usermodule');

var ObjectId = require('mongodb').ObjectId;

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

router.post('/search', function(req, res){
	var col = req.db.get('users');
	var userid = req.body.userid;

	usermod.searchUser(userid, col, function(err, doc){
		if(err){
			utils.render('users/search', {'title': 'Search Error!'});
		}else{
			if(doc.length === 0){
				var title = "No such userid";
			}else{
				var title = "Searching Results for " + userid;
			}

			utils.render('users/search', {'search_term': userid, 'title': title, 'userlist': doc.map(function(d){ d['_id'] = col.cast(d['_id'])})})(req, res);
		}
	});
});

//Change the info of a specific user
router.get('/change/:id', function(req, res){
	var userid = req.params.id;
	var col = req.db.get('users');

	usermod.getUserInfo(userid, col, function(err, doc){
		if(err){
			res.send('Failed to change the user info!');
		}else{
			if(doc && doc.address){
				var addr = doc.address.split('|');

				doc['address_street'] = addr[0];
				doc['address_city'] = addr[1];
				doc['address_state'] = addr[2];
				doc['address_zip'] = addr[3];
			}

			utils.render('users/detail', {'userinfo': doc})(req, res);
		}
	});
});

router.post('/change', function(req, res){
	var userObj = req.body;
	var col = req.db.get('users');

	usermod.changeUser(userObj, col, function(err, doc){
		if(err){
			res.end('Faield to update!');
		}else{
			// console.log(doc);
			res.redirect('search');
		}
	})
});


router.get('/delete/:_id', function(req, res){

	var _id = req.params._id;

	var col = req.db.get('users');

	usermod.deleteUser(_id, col, function(err, doc){
		if(err){
			res.send('Faield deleting!');
		}else{
			res.redirect('../search');
		}
	})
});

//Delete user
router.post('/delete', function(req, res){
	var _id = req.body._id;
	var col = req.db.get('users');

	usermod.deleteUser(_id, col, function(err, doc){
		if(err){
			res.send('Failed deleting!');
		}else{
			res.redirect('search');
		}
	});
});

module.exports = router;
