var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');


router.get('/', function(req, res) {
	res.render('index', {title: 'Hello World!'});
})

module.exports = router;
