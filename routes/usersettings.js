var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();
var utils = require('../utils');
var session = require('../sessionModule');
var sid = new session();
router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/settings', function (req, res, next){
		var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
				if (err){
					res.send("error!")
				}else{
					userid = doc.userid;
					userobj = {"userid":userid};
					settings.receiveemail(userobj,function (err,doc){
									if(err){
										res.send('err')
									}else{
										utils.render('./yongred/user_setting',
											{"userid":userid,"receiveEmails":doc.email,"su":false})(req, res, next);
									}
					})
				}

		})
});

router.get('/supervisor/settings', function (req, res, next){
		var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
				if (err){
					res.send("error!")
				}else{
					userid = doc.userid;
					userobj = {"userid":userid};
					settings.receiveemail(userobj,function (err,doc){
									if(err){
										res.send('err')
									}else{
										res.render('./yongred/user_setting',
											{	"userid":userid,
												"receiveEmails":doc.email,
												"su":true,
												"enableEmail":doc.enableEmail,
												"enablerate":doc.enablerate,
												"overtime":doc.overtime,
												"newrate":doc.curRate});
									}
					})
				}

		})
});

router.get('/supervisor/sendemail', function (req, res, next){
		var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
			if (err){
				res.send('err')
<<<<<<< HEAD
			}else{			
				res.render('./staff/staff_setting_su',{"userid":doc.userid,
							"su":true,
=======
			}else{
				res.render('./yongred/user_setting',{"userid":doc.userid,"su":true,
>>>>>>> 0e9f3a273dd709655e58db7271011597efe4e585
							"enableEmail":doc.enableEmail,
							"enablerate":doc.enablerate,
							"overtime":doc.overtime,
							"newrate":doc.newrate});
			}
		})
});

router.get('/supervisor/setrate',function (req,res){
	var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
			if (err){
				res.send('err')
			}else{
				res.render('./yongred/user_setting',{"userid":doc.userid,"su":true,
							"enableEmail":doc.enableEmail,
							"enablerate":doc.enablerate,
							"overtime":doc.overtime,
							"newrate":doc.newrate});
			}
		})
});

router.post('/enableEmail/:switchs',function (req,res){
	var switchs = parseInt(req.params.switchs)
	if(req.params.switchs == 1){
		switchs=0;
	}else{
		switchs=1;
	}
	userobj={'userid': req.body.id,
			'enableEmail':switchs};
	settings.enableEmail(userobj,function(err,doc){
			if(err) {
			 	res.send("Error!!!");
		}else{
<<<<<<< HEAD
			res.render('./staff/staff_setting_su',{"userid":req.body.userid,"su":true})
=======
			res.render('./yongred/user_setting',{"userid":req.body.userid,"su":true,"enablerate":switchs})
>>>>>>> 0e9f3a273dd709655e58db7271011597efe4e585
		}
	})

})

router.post('/enablerate/:switchs',function (req,res){
	var switchs
	if(req.params.switchs == 1){
		switchs=0;
	}else{
		switchs=1;
	}
	//res.render('./staff/staff_setting');
	userobj={'userid': req.body.id,
			'enablerate':switchs};
	console.log(userobj)
	settings.enablerate(userobj,function(err,doc){
			if(err) {
			 	res.send("Error!!!");
		}else{
<<<<<<< HEAD
			res.render('./staff/staff_setting_su',{"userid":req.body.userid,"su":true})
=======
			res.render('./yongred/user_setting',{"userid":req.body.userid,"su":true,"enablerate":switchs})
>>>>>>> 0e9f3a273dd709655e58db7271011597efe4e585
		}
	})

})
router.post('/supervisor/setrate',function (req,res){
	var userobj=req.body;
	console.log(userobj)
	settings.enablerate(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});
	settings.setrate(userobj,function (err,doc){
		if (err||!doc||doc.length==0){
			res.send('err');
		}else{
			//console.log(doc)
			res.render("./yongred/user_setting",
						{	"userid":userobj.userid,
							"receiveEmails":doc.email,
							"oldpassword":doc.password,
							"su":true,
							"enableEmail":userobj.enableEmail,
							"enablerate":userobj.enablerate,
							"overtime":userobj.overtime,
							"newrate":userobj.newrate
						});
		}
	})
});

router.post('/settings', function (req, res, next) {
	var userobj=req.body;
	console.log(userobj);
	settings.changepass(userobj,function(err, doc){
		if(err) {
			 next(err);
		}else if(!doc){
			utils.render("message",{success: false,
                		msg: {head:res.__("changepass failed, maybe wrong password")},
                		pageUrl: '/settings'})(req,res,next);

		}else{
				utils.render("message",{success: true,
                		msg: {head:res.__("changepass successful")},
                		pageUrl: '/settings'})(req,res,next);
			}
	});
});

router.post('/supervisor/settings', function (req, res) {
	var userobj=req.body;
	console.log(userobj)
	settings.changepass(userobj,function (err, doc,next){
		if(err) {
			 next("Error!!!");
		}else if(!doc){
			utils.render("message",{success: false,
                		msg: {head:res.__("changepass failed, maybe wrong password")},
                		pageUrl: '/supervisor/settings'})(req,res,next);
				
		}else{
<<<<<<< HEAD
				
			utils.render("message",{success: true,
                		msg: {head:res.__("changepass successful")},
=======
				/*utils.render("./yongred/user_setting",
					{"userid":userobj.userid,"receiveEmails":doc.email,"su":true,
							"enableEmail":doc.enableEmail,
							"message":true,
							"enablerate":doc.enablerate,
							"overtime":doc.overtime,
							"newrate":doc.curRate})(req,res,next);*/
	utils.render("message",{success: true,
                		msg: {head:"changepass successful"},
>>>>>>> 0e9f3a273dd709655e58db7271011597efe4e585
                		pageUrl: '/supervisor/settings'})(req,res,next);
				}
			
	});
});

router.post('/supervisor/sendemail', function (req, res) {
	var userobj=req.body;
	console.log(userobj)
	settings.updateemail(userobj,function(err,doc){

		if(err) {
			 res.send("Error!");
		}
		else if(!doc || doc.length === 0){
				res.send('userid or password invaild');
			}
			else{
				console.log(doc)
			res.render('./yongred/user_setting',{"userid":userobj.userid,
						"receiveEmails":userobj.receiveEmails,"su":true,
							"enableEmail":userobj.enableEmail,
							"enablerate":userobj.enablerate,
							"overtime":doc.overtime,
							"oldpassword":doc.password,
							"newrate":doc.curRate});
		}
	});


	settings.enableEmail(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});

	//settings.sendemail(userobj);

})

//settings.db.close();


module.exports = router;
