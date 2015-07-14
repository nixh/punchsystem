var express = require('express');
var router = express.Router();
var usersetting = require('../usersettingModule');
var settings = new usersetting();

router.get('/', function(req, res, next){

	res.render('usersettings');
});

router.get('/changepwd', function (req, res, next){
		
		res.render('changepwd2');

});

router.get('/sendemail', function (req, res, next){
		
		res.render('changepwd3');

});

router.get('/setrate',function (req,res){
	
	res.render('changepwd');
});



router.post('/setrate',function (req,res){
	var userobj=req.body;
	settings.switchinformation(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});
	settings.setrate(userobj,function (err,doc){
		console.log(userobj)
		if (err){
			res.send('err');
		}else{
			console.log(doc)
			res.render("changepwd");
		}
	})
});

router.post('/changepwd', function (req, res) {
	var userobj=req.body;
	settings.switchinformation(userobj,function(err,doc){
		if(err) {
			 res.send("Error!!!");
		}
	});
	settings.changepass(userobj,function(err, doc){
		if(err) {
			 res.send("Error!!!");
		}else{
			res.render("changepwd2");
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
			
			var email= doc.email;
			res.render('changepwd3',{"receiveemail":email});
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

//settings.db.close();
	

module.exports = router;
