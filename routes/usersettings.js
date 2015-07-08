var express = require('express');
var router = express.Router();

var settings = require('../usersetting')

router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function(req, res, next){
	
	//var db = req.db;
	//console.log(123);
	//db.get('users').findOne({userid:1}, {}, function(err,  doc){

		res.render('changepwd');

});
	
	



router.post('/changepwd', function (req, res) {
	var userid=req.body.userid;
	var collection=req.db.get('users');
	var oldpass= req.body.oldpass;
	var newpass= req.body.newpass;
	
	
	userid = parseInt(userid);
	/*settings.savelocation(userid,location,function(err,doc){
		if(err)
			return res.send("Error!");
	})*/
	settings.changepass(userid,oldpass,newpass, function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}
		//else{
			//res.render('changepwd');
		//}
	})

	settings.receiveemail(userid,function(err,doc){
		if(err) {
			return res.send("Error!");
		}
		else {
			//res.redirect('chargepwd')
			var email= doc.email
			console.log(email);
			res.render('changepwd',{"receiveemail":email});
			//res.send(doc);
		}
	})

	settings.enablesendemail(userid,req.body.frequency,function(err,doc){
		if(err) {
			res.send("Email Error!");
		}

	})

})
module.exports = router;