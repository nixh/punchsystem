var express = require('express');
var router = express.Router();

var settings = require('../usersetting')

router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function(req, res, next){
	

		res.render('changepwd');
	
});


router.post('/changepwd', function (req, res) {
	var userid=req.body.userid;
	var collection=req.db.get('users');
	var oldpass= req.body.oldpass;
	var newpass= req.body.newpass;
	
	
	userid = parseInt(userid);
	
	settings.changepass(userid,oldpass,newpass, function(err, doc){
		if(err)

			return res.send("Error!!!");
	
	});

	settings.receiveemail(userid,function(err,doc){
		if(err){
			return res.send("Error!");
		}
		else{
			//res.redirect('chargepwd')
			res.render('changepwd',{"receiveemail":doc});
			//res.send(doc);
		}
	})

	settings.enablesendemail(userid,req.body.frequency,function(err,doc){
		if(err)
				{
					 res.send("Email Error!");

				}

	})
})




module.exports = router;