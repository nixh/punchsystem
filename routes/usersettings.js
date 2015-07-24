var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();
var utils = require('../utils');
var session = require('../sessionModule');
var sid = new session();
router.get('/', function(req, res, next){
	if (err) {
		next(err);
	}else {
	utils.render('usersettings')(req,res,next);
	}
});

router.get('/settings', function (req, res) {
	var id = req.cookies.sessionid;
	var userid;
	var userobj;
	sid.getSessionInfo(id,function (err,doc,next) {
		if (err) {
			next(err);
		}else {
			userid = doc.userid;
			userobj = {"userid":userid};
			settings.receiveemail(userobj,function (err,doc,next) {
				if(err){
					next(err);
				}else{
					utils.render('./staff/staff_setting_su',
						{"userid":userid,"receiveEmails":doc.email,"su":false})(req, res, next);
				}
			})
		}
	})
});

router.get('/supervisor/settings', function (req, res) {
	var id = req.cookies.sessionid;
	var userid;
	var userobj;
	sid.getSessionInfo(id,function(err,doc){
		if (err) {
			res.send("error!")
		}else {
			userid = doc.userid;
			userobj = {"userid":userid};
			settings.receiveemail(userobj,function (err,doc,next){
				if(err) {
					next(err)
				}else {
					utils.render('./staff/staff_setting_su',
						{"userid":userid,
						"receiveEmails":doc.email,
						"su":true,
						"enableEmail":doc.enableEmail,
						"enablerate":doc.enablerate,
						"overtime":doc.overtime,
						"newrate":doc.curRate})(req,res,next);
				}
			})
		}
	})
});

router.get('/supervisor/sendemail', function (req, res){
	var id = req.cookies.sessionid;
	var userid;
	var userobj;
	sid.getSessionInfo(id,function (err,doc,next){
		if(err) {
			next(err);
		}else {			
			utils.render('./staff/staff_setting_su',
				{"userid":doc.userid,
				"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.newrate})(req,res,next);
		}
	})
});

router.get('/supervisor/setrate',function (req,res){
	var id = req.cookies.sessionid;
	var userid;
	var userobj;
	sid.getSessionInfo(id,function (err,doc,next){
		if(err) {
			next(err);
		}else {
			utils.render('./staff/staff_setting_su',
				{"userid":doc.userid,"su":true,
				"enableEmail":doc.enableEmail,
				"enablerate":doc.enablerate,
				"overtime":doc.overtime,
				"newrate":doc.newrate})(req,res,next);
		}
	})
});

router.post('/enableEmail/:switchs',function (req,res,next){
	var switchs = parseInt(req.params.switchs)
	if(req.params.switchs == 1){
		switchs=0;
	}else{
		switchs=1;
	}
	userobj={'userid': req.body.id,
			'enableEmail':switchs};
	settings.enableEmail(userobj,function (err,doc,next){
		if(err) {
			next(err);
		}else {
			utils.render('./staff/staff_setting_su',{"userid":req.body.userid,"su":true})(req,res,next);
		}
	})

})

router.post('/enablerate/:switchs',function (req,res){
	var switchs
	if(req.params.switchs == 1) {
		switchs=0;
	}else {
		switchs=1;
	}
	userobj={'userid': req.body.id,
			'enablerate':switchs};
	settings.enablerate(userobj,function (err,doc,next){
		if(err) {
			next(err);
		}else {
			utils.render('./staff/staff_setting_su',
				{"userid":req.body.userid,"su":true})(req,res,next);
		}
	})
})
router.post('/supervisor/setrate',function (req,res){
	var userobj=req.body;
	settings.enablerate(userobj,function(err,doc){
		if(err) {
			next(err);
		}
	});
	settings.setrate(userobj,function (err,doc,next) {
		if (err||!doc||doc.length==0) {
			res.send('err');
		}else {
			utils.render("./staff/staff_setting_su",
				{"userid":userobj.userid,
				"receiveEmails":doc.email,
				"oldpassword":doc.password,
				"su":true,
				"enableEmail":userobj.enableEmail,
				"enablerate":userobj.enablerate,
				"overtime":userobj.overtime,
				"newrate":userobj.newrate})(req,res,next);
		}
	})
});

router.post('/settings', function (req, res) {
	var userobj=req.body;
	console.log(userobj);
	settings.changepass(userobj,function (err, doc,next) {
		if(err) {
			next(err);
		}else if(!doc) {
			utils.render("message",{success: false,
	    		msg: {head:res.__("changepass failed, maybe wrong password")},
	    		pageUrl: '/settings'})(req,res,next);

		}else {
			utils.render("message",{success: true,
	    		msg: {head:res.__("changepass successful")},
	    		pageUrl: '/settings'})(req,res,next);
		}
	});
});

router.post('/supervisor/settings', function (req, res) {
	var userobj=req.body;
	settings.changepass(userobj,function (err, doc,next){
		if(err) {
			next("Error!!!");
		}else if(!doc) {
			utils.render("message",{success: false,
        		msg: {head:res.__("changepass failed, maybe wrong password")},
        		pageUrl: '/supervisor/settings'})(req,res,next);
				
		}else {
			utils.render("message",{success: true,
	    		msg: {head:res.__("changepass successful")},
	    		pageUrl: '/supervisor/settings'})(req,res,next);
		}
			
	});
});

router.post('/supervisor/sendemail', function (req, res) {
	var userobj=req.body;
	console.log(userobj)
	settings.updateemail(userobj,function (err,doc,next){
		if(err) {
			next(err);
		}
		else if(!doc || doc.length === 0) {
			next('userid or password invaild');
		}else {
			console.log(doc)
			utils.render('./staff/staff_setting_su',
					{"userid":userobj.userid,
					"receiveEmails":userobj.receiveEmails,"su":true,
					"enableEmail":userobj.enableEmail,
					"enablerate":userobj.enablerate,
					"overtime":doc.overtime,
					"oldpassword":doc.password,
					"newrate":doc.curRate})(req,res,next);
		}
	});
	settings.enableEmail(userobj,function(err,doc){
		if(err) {
			res.send("Error!!!");
		}
	});
})




module.exports = router;
