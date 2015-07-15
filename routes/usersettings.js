var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();

router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd/:userid', function (req, res, next){
		var userid=req.params.userid;
		res.render('./staff/staff_setting',{"userid":userid});
});

router.get('/sendemail/:userid', function (req, res, next){
		var userid=req.params.userid;
		res.render('./staff/staff_setting',{"userid":userid});
});

router.get('/setrate/:userid',function (req,res){
	var userid=req.params.userid;
	res.render('./staff/staff_setting',{"userid":userid});
});

router.post('/enableEmail/:switchs',function (req,res){
	var switchs
	if(req.params.switchs == 1){
		switchs=0;
	}else{
		switchs=1;
	}
	//res.render('./staff/staff_setting');
	userobj={'userid': req.body.id,
			'enableEmail':switchs};
	console.log(userobj)
	settings.enableEmail(userobj,function(err,doc){
			if(err) {
			 	res.send("Error!!!");
		}else{
			res.render('./staff/staff_setting',{"userid":req.body.userid})
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
			res.render('./staff/staff_setting',{"userid":req.body.userid})
		}
	})

})
router.post('/setrate',function (req,res){
	var userobj=req.body;
	console.log(userobj)
	settings.enablerate(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});
	settings.setrate(userobj,function (err,doc){
		if (err){
			res.send('err');
		}else{
			//console.log(doc)
			res.render("./staff/staff_setting",{"userid":userobj.userid});
		}
	})
});

router.post('/changepwd', function (req, res) {
	var userobj=req.body;

	settings.changepass(userobj,function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}else{
			
			res.render("./staff/staff_setting",{"userid":userobj.userid});
		}
	});
});

router.post('/sendemail', function (req, res) {
	var userobj=req.body;
	
	settings.receiveemail(userobj,function(err,doc){
		
		if(err) {
			 res.send("Error!");
		}
		else if(!doc || doc.length === 0){
				res.send('userid or password invaild');
			} 
			else{
			res.render('./staff/staff_setting',{"userid":userobj.userid,"receiveEmails":doc.email});
			//res.send(doc);
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
