var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');

var settings = new usersetting();
router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function(req, res, next){

		res.render('changepwd');

});


router.post('/changepwd', function (req, res) {
	var userobj=req.body;
	
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
			//res.redirect('chargepwd')
			var email= doc.email;
			res.render('changepwd',{"receiveemail":email});
			//res.send(doc);
		}
	});
	
	settings.switchinformation(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});

	settings.sendemail(userobj);
})	

		

module.exports = router;
