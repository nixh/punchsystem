var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next){
	
	res.render('test/prac', { name:"Yong D Liu"});
});

router.get('/login', function(req, res, next){
	
	res.render('login');
});

router.get('/staff_main', function(req, res, next){
	
	res.render('staff_main', {
		users: {
			company_userid : "company_userid",
			name : "name",
			createDate: "Date",
			password: "password", // Encrypted Text
			sex : true,
			email : 1231425
		}
	});
});


module.exports = router;
