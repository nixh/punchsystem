var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/message', function(req, res, next){

	res.render('message', {});
});

router.get('/test', function(req, res, next){

	res.render('test/test', { title: 'Express', name: 'T', success: false });
});

router.get('/supervisor_add_user', function(req, res, next){

	res.render('supervisor_add_user', { title: 'Express', name: 'T', success: false });
});

router.get('/checkin_report', function(req, res, next){

	res.render('checkin_report', { title: 'Express', name: 'T', success: false });
});

router.get('/Manage_Modifying_User', function(req, res, next){

	res.render('Manage_Modifying_User', { title: 'Express', name: 'T', success: false });
});

router.get('/Many', function(req, res, next){

	res.render('Many', { title: 'Express', name: 'T', success: false });
});

router.get('/search', function(req, res, next){

	res.render('search', { title: 'Express', name: 'T', success: false });
});

router.get('/manage_punch', function(req, res, next){

	res.render('manage_punch', { title: 'Express', name: 'T', success: false });
});

router.get('/manage_info', function(req, res, next){

	res.render('manage_info', { title: 'Express', name: 'T', success: false });
});


module.exports = router;
