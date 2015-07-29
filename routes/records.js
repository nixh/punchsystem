var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var moment = require('moment');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');
var recModule = require('../recModule');
var sessionModule = require('../sessionModule');

router.get('/staff_delegate:uid', function(req, res, next) {
    var rm = new recModule();
    var sessionid = req.cookies.seccionid;
    var userid = req.params.uid;
    query = {userid : userid};
    rm.checkDelegate(query, function(err, dels) {
        var delegate = false;
        if (dels) {
            delegate = true;
        }
        res.render('', delegate);
    });
});

router.get('/supervisor_delegate', function(req, res, next){
    var rm = new recModule();
    var sessionid = req.cookies.sessionid;
    rm.showUsersForDelegate(sessionid, function(err, ret) {
        res.render('supervisor/supervisor_delegate', ret);
    });
});

router.get('/supervisor/delegate_action/:userid/:flag', function(req, res, next) {
    var rm = new recModule();
    var userid = req.params.userid;
    var sessionid = req.cookies.sessionid;
    var flag = parseInt(req.params.flag);
    var query = {userid : userid, sessionid : sessionid, flag : flag};
    rm.delegate(query, function(err, msg) {
        if (err) {

        } else {
            res.end('{success: true}');
        }
    });
});

router.get('/punch_records', function(req, res, next){
    var rm = new recModule();
    var sid = req.cookies.sessionid;
    var query = {userid: sid};
    rm.punch(query, function(){});
});

router.post('/records_search', function(req, res, next) {
    var rm = new recModule();
    var sm = new sessionModule({db: rm.db});
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var sessionid = req.cookies.sessionid;
    sm.getSessionInfo(sessionid, function(err, sessionDoc){
        var userid = sessionDoc.userid;
        var query = {inDate: {"$gte": starttime} , outDate: {"$lte": endtime}, userid: userid};
        var query1 = {inDate: {"$gte": starttime} , outDate: null, userid: userid};
        var fq = { $or: [query, query1]}
        rm.searchRecords(fq, function(jsonData) {
            jsonData.su = false;
            jsonData.tr = res.__;
            jsonData.moment = moment;
            res.render('staff/staff_punch_report', jsonData);
        });
    });
});

router.get('/supervisor/records_search/', function(req, res, next) {
    var rm = new recModule();
    var starttime = Date.parse(req.query.startdate);
    var endtime = Date.parse(req.query.enddate);
    var userid = req.query.userid;
    var su = req.path.search("supervisor");
    var query = {inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid};
    rm.searchRecords(query, function(jsonData) {
        jsonData.su = true;
        jsonData.tr = res.__;
        res.render('supervisor/supervisor_punch_report', jsonData);
    });
});

router.get('/records_show/:uid', function(req, res, next) {
    var rm = new recModule();
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
    var rm = new recModule();
    var userid = req.params.uid;
    var su = req.path.search("supervisor");
    var query = {
        userid: userid
    };
    rm.searchRecords(query, su, function(jsonData) {
        jsonData.tr = res.__;
        jsonData.moment = moment;
        res.render('supervisor/supervisor_punch_report', jsonData);
    });
});

router.get('/supervisor/records_delete/:rid', function(req, res, next) {
    var rm = new recModule();
    var rid = req.params.rid;
    rm.deleteRecords(rid, function(msg) {
        if (msg) {
            res.send('Successfully deleted');
        } else {
            res.send('Failed to delete, try again');
        }
    });
});

router.post('/supervisor/records_delete', function(req, res, next) {
    var rm = new recModule();
    var _id = req.body.id;
    console.log(_id);
    rm.deleteRecords(_id, function(err, doc){
        rm.db.close();
        res.type('json');
        if (err) {
            res.send({"success": false, "msg":err.message});
        } else {
            res.send({"success": true});
        }
    });
});
router.post('/supervisor/records_update', function(req, res, next) {
    var rm = new recModule();
    var _id = req.body.id;
    var inDate = req.body.inDate;
    var outDate = req.body.outDate;
    var format = "YYYY-MM-DD hh:mm A";
    var query = {
        _id : _id
    };
    var newrec = {};

    newrec['inDate'] = moment(inDate, format).valueOf();
    newrec['outDate'] = moment(outDate, format).valueOf();
    
    rm.updateRecords(query, newrec, function(err, docs) {
        rm.db.close();
        res.type('json');
        if (err) {
            res.send({"success": false, "msg":err.message});
        } else {
            res.send({"success": true});
        }
    });
});

router.post('/records_getWagesByUsers', function(req, res, next) {
    var rm = new recModule();
    var userid = req.body.userid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {userid: userid, startDate: startDate, endDate: endDate};
    rm.getWagesByWeek(query, function(jsonData) {
        res.render('', jsonData); // Need the page to be render
    });
});

router.post('/records_getWagesByWeek', function(req, res, next) {
    var rm = new recModule();
    var compid = req.body.compid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {compid : compid, startDate : startDate, endDate : endDate};
    rm.getWageReport(query, function(jsonData) {
        res.render('', jsonData); // Need the page to be render
    });
});

router.post('/records_getWagesByMonth', function(req, res, next) {
    var rm = new recModule();
    var compid = req.body.compid;
    var startDate = Date.parse(req.body.startdate);
    var endDate = Date.parse(req.body.enddate);
    var query = {compid : compid, startDate : startDate, endDate : endDate};
    rm.getWageReport(query, function(jsonDataArray) {
        res.render('', jsonDataArray); // Need the page to be render
    });
});

module.exports = router;
