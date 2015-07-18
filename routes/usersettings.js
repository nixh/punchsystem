var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();
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
										res.render('./staff/staff_setting_su',
											{"userid":userid,"receiveEmails":doc.email,"su":false});
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
										res.render('./staff/staff_setting_su',
											{	"userid":userid,
												"receiveEmails":doc.email,
												"su":true,"overtime":doc.overtime,
												"newrate":doc.curRate});
									}
					})
				}

		})
});

router.get('/sendemail', function (req, res, next){
		var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
			if (err){
				res.send('err')
			}else{
				res.render('./staff/staff_setting_su',{"userid":doc.userid,"su":true});
			}
		})
});

router.get('/setrate',function (req,res){
	var id = req.cookies.sessionid;
		var userid;
		var userobj;
		sid.getSessionInfo(id,function(err,doc){
			if (err){
				res.send('err')
			}else{
				res.render('./staff/staff_setting_su',{"userid":doc.userid,"su":true});
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
	//res.render('./staff/staff_setting');
	userobj={'userid': req.body.id,
			'enableEmail':switchs};
	settings.enableEmail(userobj,function(err,doc){
			if(err) {
			 	res.send("Error!!!");
		}else{
			res.render('./staff/staff_setting_su',{"userid":req.body.userid,"enableEmail":switchs,"su":true})
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
			res.render('./staff/staff_setting_su',{"userid":req.body.userid,"enablerate":switchs,"su":true})
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
			res.render("./staff/staff_setting_su",
						{	"userid":userobj.userid,
							"receiveEmails":doc.email,
							"su":true,
							"overtime":userobj.overtime,
							"newrate":userobj.newrate});
		}
	})
});

router.post('/settings', function (req, res) {
	var userobj=req.body;
	settings.changepass(userobj,function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}else{
				res.render("./staff/staff_setting_su",{"userid":userobj.userid,"su":false});
				}
	});
});

router.post('/supervisor/settings', function (req, res) {
	var userobj=req.body;
	console.log(userobj)
	settings.changepass(userobj,function (err, doc){
		if(err) {
			 res.send("Error!!!");
		}else{
			console.log(doc)
				res.render("./staff/staff_setting_su",
					{"userid":userobj.userid,"receiveEmails":doc.email,"su":true});
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
			res.render('./staff/staff_setting_su',{"userid":userobj.userid,
						"receiveEmails":userobj.receiveEmails,"su":true});
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
