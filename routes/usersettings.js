var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');


router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function(req, res, next){

		res.render('changepwd');

});


router.post('/changepwd', function (req, res) {
	var userobj=req.body;
	var settings = new usersetting();
	settings.changepass(userobj,function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}
	});

	 settings.receiveemail(userobj,function(err,doc){
		if(err) {
			return res.send("Error!");
		}
		else {
			if(!doc || doc.length === 0){
				res.send('userid or password invaild');
			} else{
			//res.redirect('chargepwd')
			var email= doc.email;
			res.render('changepwd',{"receiveemail":email});
			//res.send(doc);
		}
	}
});
	
	settings.switchinformation(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});

	settings.sendemail(userobj,function(err,doc){
		if(err){
			res.send('error')
		}else if(!doc|| doc.length ===0){
			res.send("invaild email address!")
		}
	});
	settings.db.close();
})	

		

module.exports = router;
