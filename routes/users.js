var express = require('express');
var router = express.Router();

var usermodule = require('../usermodule');
var utils = require("../utils");

var multiparty = require('multiparty');

var util = require('util');

var um = new usermodule();

var Action = require('../lib/common/action');

router.get('/new', Action('user.newUser'));

// Add a new user
router.get('/add', utils.render('users/adduser', {}));
router.post('/add', function(req, res, next) {

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        if (err) {
            next(err);
        } else {
            var userObj = {};
            for (var key in fields) {
                userObj[key] = fields[key][0];
            }
            delete userObj._id;

            var sm = new sModule();
            var col = sm.db.get('users');


            sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {

                userObj.compid = sObj.compid;
                um.addUser(userObj, function(err, doc) {
                    if (err) {
                        utils.render('users/search')(req, res);
                    } else {
                        // console.log(doc);
                        var loc = '/supervisor/supervisor_main';
                        res.redirect(loc);
                    }
                });
            });
        }
    });
});


// Display all users and search users
router.get('/search', function(req, res) {
    var sm = new sModule();
    var col = sm.db.get('users');
    var userid = req.body.userid;

    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {

        um.getAllUsers({
            compid: sObj.compid
        }, function(err, doc) {
            var title;
            if (err) {
                utils.render('users/search', {
                    'title': 'Loading Users Erro!'
                })(req, res);
            } else {
                if (doc.length === 0) {
                    title = "There is not even one user!";
                } else {
                    title = "All User List";
                }

                utils.render('users/search', {
                    'title': title,
                    'userlist': doc
                })(req, res);
            }
        });

    });
});

var sModule = require('../sessionModule');

router.post('/search', function(req, res) {

    var sm = new sModule();
    var col = sm.db.get('users');
    var userid = req.body.userid;

    sm.getSessionInfo(req.cookies.sessionid, function(err, sObj) {
        um.searchUser(userid, sObj.compid, function(err, doc) {
            var title;

            if (err) {
                utils.render('users/search', {
                    'title': 'Search Error!'
                });
            } else {
                if (doc.length === 0) {
                    title = "No such userid";
                } else {
                    title = "Searching Results for " + userid;
                }
                utils.render('users/search', {
                    'search_term': userid,
                    'title': title,
                    'userlist': doc
                })(req, res);
            }
            sm.db.close();
        });

    });

});

//Change the info of a specific user
router.get('/change/:id', function(req, res) {
    var userid = req.params.id;

    um.getUserInfo(userid, function(err, doc) {
        if (err) {
            res.send('Failed to change the user info!');
        } else {
            if (doc && doc.address) {
                var addr = doc.address.split('|');

                doc['address_street'] = addr[0];
                doc['address_city'] = addr[1];
                doc['address_state'] = addr[2];
                doc['address_zip'] = addr[3];
            }

            utils.render('users/detail', {
                'userinfo': doc
            })(req, res);
        }
    });
});

var fs = require('fs');

router.post('/change', function(req, res, next) {

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        if (err)
            return next(err);

        var userObj = {};
        for (var key in fields) {
            userObj[key] = fields[key][0];
        }

        um.changeUser(userObj, function(err, doc) {
            if (err) {
                next(err);
            } else {
                // console.log(doc);
                var loc = '/supervisor/supervisor_main';
                res.redirect(loc);
            }
        });
    });
});

// router.post('/preview_avatar', function(req, res){
//
// 	var form = new multiparty.Form();
//
// 	console.log('Now changing user info');
//
// 	form.parse(req, function(err, fields, files){
// 		if(err)
// 			return next(err);
//
// 		console.log(files);
// 		console.log(fields);
//
// 		var userObj = {};
// 		for(var key in fields){
// 			userObj[key] = fields[key][0];
// 		}
//
// 		console.log('This is the copied object...');
// 		console.log(JSON.stringify(userObj));
//
//
//
// 	});
//
// });


router.get('/delete/:_id', function(req, res) {

    var _id = req.params._id;

    um.deleteUser(_id, function(err, doc) {
        if (err) {
            res.send('Faield deleting!');
        } else {
            res.redirect('../search');
        }
    });
});

//Delete user
router.post('/delete', function(req, res) {
    var _id = req.body._id;

    um.deleteUser(_id, function(err, doc) {
        if (err) {
            res.send('Failed deleting!');
        } else {
            res.redirect('search');
        }
    });
});

module.exports = router;
