var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchtest');

/* GET home page. */
router.get('/', function(req, res, next) {
    var test = db.get('test');
    var results = test.find({}, {});
    res.render('index', { title: 'Express', ret: results });
});

router.get('/test/:name', function(req, res, next) {
    var col = db.get(req.params.name);
    col.find({}, {limit:20}, function(e, docs){
        res.json(docs);
    });

});

module.exports = router;
