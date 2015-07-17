var express = require('express');
var router = express.Router();

var usermodule = require('../usermodule');
var utils = require("../utils");

var multiparty = require('multiparty');

var util = require('util');

var um = new usermodule();

// Add a new user
router.get('/add', utils.render('users/adduser', {title: 'UserAdd'}));
router.post('/add', function(req, res){
	var col = req.db.get('users');
	var userObj = req.body;

	um.addUser(userObj, function(err, doc){
		if(err){
			res.send('Add user failed!');
		}else{
			console.log("The returned doc of adduser is...");
			console.log(doc);
			res.redirect('search');
		}
	});
});


// Display all users and search users
router.get('/search', function(req, res){
    var sm = new sModule();
	var col = sm.db.get('users');
	var userid = req.body.userid;

    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj){

        um.getAllUsers({compid: sObj.compid}, function(err, doc){
            var title;
	if(err){
		utils.render('users/search', {'title': 'Loading Users Erro!'})(req, res);
	}else{
		if(doc.length === 0){
			title = "There is not even one user!";
		}else{
			title = "All User List";
		}

		utils.render('users/search', {'title': title, 'userlist': doc})(req, res);
	}
        });

    });
});

var sModule = require('../sessionModule');

router.post('/search', function(req, res){

	console.log('Now in the users router, receiving post request from others...');
	console.log(JSON.stringify(req.body));

    var sm = new sModule();
	var col = sm.db.get('users');
	var userid = req.body.userid;

        sm.getSessionInfo(req.cookies.sessionid, function(err, sObj){
            um.searchUser(userid, sObj.compid, function(err, doc){
                var title;

                if(err){
                        utils.render('users/search', {'title': 'Search Error!'});
                }else{
                        if(doc.length === 0){
                                title = "No such userid";
                        }else{
                                title = "Searching Results for " + userid;
                        }
                        utils.render('users/search', {'search_term': userid, 'title': title, 'userlist': doc})(req, res);
                }
                sm.db.close();
            });

        });

});

//Change the info of a specific user
router.get('/change/:id', function(req, res){
	var userid = req.params.id;

	um.getUserInfo(userid, function(err, doc){
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

var fs = require('fs');

router.post('/change', function(req, res, next){


	var form = new multiparty.Form();

	console.log(JSON.stringify(req.body));
	console.log('Now changing user info');

	form.parse(req, function(err, fields, files){
		if(err)
			return next(err);

		console.log(files);

		var userObj = {};
		for(var key in fields){
			userObj[key] = fields[key][0];
		}

		//Avatar is from url
		if(files.avatar[0].size == 0){

			um.changeUser(userObj, function(err, doc){
			   	if(err){
			   		utils.render('users/search')(req, res);
			   	}else{
			   		// console.log(doc);
			   		res.redirect('/supervisor/employees');
			   	}
			});

		//Avatar from upload
		}else{
			var image = files.avatar[0];
			var imgPath = image.path;

			fs.readFile(imgPath, function(err, data){
				if(err){
					utils.render('users/search')(req, res);
				}else{
					var base64Image = new Buffer(data, 'binary').toString('base64');
					var finalData = "data:" + image.headers['content-type']  + "; base64," + base64Image;

					userObj['avatar'] = finalData;

					um.changeUser(userObj, function(err, doc){
					   	if(err){
					   		utils.render('users/search')(req, res);
					   	}else{
					   		// console.log(doc);
					   		res.redirect('/supervisor/employees');
					   	}
					});

				}
			});

			// 并没有卵用
			// var image = files.avatar[0];
			// var imgPath = image.path;
			//
			// var path = __dirname + "/../resize/";
			//
			// new Imagemin().src(imgPath).dest(path).use(Imagemin.jpegtran({progressive: true})).run(function(err, file){
			// 	console.log(file[0]);
			// 	var base64Image = file[0]
			// });
		}
	});
});

router.post('/preview', function(req, res){

});


router.get('/delete/:_id', function(req, res){

	var _id = req.params._id;

	um.deleteUser(_id, function(err, doc){
		if(err){
			res.send('Faield deleting!');
		}else{
			res.redirect('../search');
		}
	});
});

//Delete user
router.post('/delete', function(req, res){
	var _id = req.body._id;

	um.deleteUser(_id, function(err, doc){
		if(err){
			res.send('Failed deleting!');
		}else{
			res.redirect('search');
		}
	});
});

module.exports = router;
