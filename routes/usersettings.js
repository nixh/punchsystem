var express = require('express');
var router = express.Router();

var settings = require('../usersetting');
var email= require('../email');
router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function(req, res, next){

		res.render('changepwd');

});
	
		var csvStringForAttachments = ["name, punchintime, punchouttime\nQ,2015-10-10 08:00:00, 2015-10-10 19:00:00"];
		
		var subject = "changepwd";
		var cc =" ";
		var html = "<p> Your password has been changed";
		var conf ={'account':'report@adminsys.us',
					'host':'adminsys.us',
					'password':'Future123456#',
					'ssl':false};	
	


router.post('/changepwd', function (req, res) {
	var userid=req.body.userid;
	var collection=req.db.get('users');
	var oldpass= req.body.oldpass;
	var newpass= req.body.newpass;
	userid = parseInt(userid);
	settings.changepass(userid,oldpass,newpass, function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}
		
	});

	 settings.receiveemail(userid,function(err,doc){
		if(err) {
			return res.send("Error!");
		}
		else {
			//res.redirect('chargepwd')
			var email= doc.email;
			res.render('changepwd',{"receiveemail":email});
			//res.send(doc);
		}
	});
		
	settings.receiveemail(userid,function(err,doc){
		if(err){
			res.send("Error!'");
		}
		else{
			var to = doc.email;
			email(conf).sendEmail(to, cc, subject, html, csvStringForAttachments);
		}
	
	});
})	

		

module.exports = router;