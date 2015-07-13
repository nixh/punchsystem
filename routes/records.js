var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var mo = require('moment');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var recModule = require('../recModule');
var rm = new recModule();
var moment = require('moment');

router.get('/punch', function(req, res, next){
    var sid = req.cookies.sessionid;
    rm.punch(sid);
});

router.post('/records_search', function(req, res, next) {
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var userid = req.body.userid;
    var su = req.path.search("supervisor");
    var query = {inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid};
    rm.searchRecords(query, su, function(jsonData) {
        jsonData.tr = res.__;
        jsonData.moment = moment;
        res.render('staff/staff_punch_report', jsonData);
    });
});

router.post('/supervisor/records_search', function(req, res, next) {
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var userid = req.body.userid;
    var su = req.path.search("supervisor");
    var query = {inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid};
    rm.searchRecords(query, su, function(jsonData) {
        res.render('staff/staff_punch_report', jsonData);
    });
});

router.get('/records_show/:uid', function(req, res, next) {
    var userid = req.params.uid;
    var su = req.path.search("supervisor");
    var query = {
        userid: userid
    };
    rm.searchRecords(query, su, function(jsonData) {
        jsonData.tr = res.__;
        jsonData.moment = moment;
        res.render('staff/staff_punch_report', jsonData);
    });
});

router.get('/supervisor/records_show/:uid', function(req, res, next) {
    var userid = req.params.uid;
    var su = req.path.search("supervisor");
    var query = {
        userid: userid
    };
    rm.searchRecords(query, su, function(jsonData) {
        jsonData.tr = res.__;
        jsonData.moment = moment;
        res.render('staff/staff_punch_report', jsonData);
    });
});

router.post('/supervisor/records_update/:rid', function(req, res, next) {
    var reportid = parseInt(req.body.rid);
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var query = {
        reportid: reportid
    };
    var newrec = {
        startDate: starttime,
        endDate: endtime
    }
    rm.updateRecords(query, newrec, function(msg) {
        res.send(msg);
    });
});

module.exports = router;
