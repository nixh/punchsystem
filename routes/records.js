var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var moment = require('moment');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var recModule = require('../recModule');
var rm = new recModule();

router.get('/punch_records', function(req, res, next){
    var sid = req.cookies.sessionid;
    var query = {userid: sid};
    rm.punch(query, function(){});
});

router.post('/records_search', function(req, res, next) {
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var userid = req.body.userid;
    var su = req.path.search("supervisor");
    var query = {inDate: {"$gte": starttime} , outDate: {"$lte": endtime}, userid: userid};
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
router.get('/supervisor/records_delete/:rid', function(req, res, next) {
    var rid = req.params.rid;
    rm.deleteRecords(rid, function(msg) {
        if (msg) {
            res.send('Successfully deleted');
        } else {
            res.send('Failed to delete, try again');
        }
    });
});
router.post('/supervisor/records_update/:rid', function(req, res, next) {
    var query = {
        userid : req.body.userid,
        inDate : moment(req.body.oriIndate).valueOf()
    };
    var newrec = {};
    if (req.body.inDate) {
        newrec['startDate'] = moment(req.body.inDate).valueOf();
    }
    if (req.body.outDate) {
        newrec['endDate'] = moment(req.body.outDate).valueOf();
    }
    rm.updateRecords(query, newrec, function(err, docs) {
        if (err) {
            res.render('', err);
        } else {
            res.render('', docs);
        }
    });
});

router.post('/records_getWagesByUsers', function(req, res, next) {
    var userid = req.body.userid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {userid: userid, startDate: startDate, endDate: endDate};
    rm.getWagesByWeek(query, function(jsonData) {
        res.render('', jsonData); // Need the page to be render
    });
});

router.post('/records_getWagesByWeek', function(req, res, next) {
    var compid = req.body.compid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {compid : compid, startDate : startDate, endDate : endDate};
    rm.getWageReport(query, function(jsonData) {
        res.render('', jsonData); // Need the page to be render
    });
});

router.post('/records_getWagesByMonth', function(req, res, next) {
    var compid = req.body.compid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {compid : compid, startDate : startDate, endDate : endDate};
    rm.getWageReport(query, function(jsonDataArray) {
        res.render('', jsonDataArray); // Need the page to be render
    });
});

module.exports = router;
