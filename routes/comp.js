var express = require('express');
var router = express.Router();

var mongodb = require('../db/db');
var moment = require('moment');
var utils = require('../utils');

router.get('/new', utils.render('comp/new'));

router.post('/new', function(req, res, next){
    var db = mongodb.getDb();
    var compCol = db.get('comp');
    compCol.findOne({name:req.body.compname}, function(e, doc){
        if(doc) {
            return res.render('comp/new', { tr: res.__, attr:{msg:'Company name duplicated!'}});
        } else {
            var comp = {
                name : req.body.compname,
                iplist : req.body.iplist,
                logo : req.body.complogo,
                expire : moment(req.body.expire).toDate().getTime(),
                remark : req.body.compremark
            }
            mongodb.newDocWithIncId('comp', comp, db, function(err, doc){
                if(err) throw err;
                console.log(doc);
                return res.render('comp/new', {tr: res.__, attr:{msg:JSON.stringify(doc)}});
            });
        }
    });
});

router.get('/login', utils.render('comp/login'));

router.post('/login', function(req, res, next){
    console.log(req.body);

    res.redirect('/comp/login');
});


module.exports = router;
