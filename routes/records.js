var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var mo = require('moment');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');

router.get('/testdb', function(req, res) {
    var records = db.get('records');
    records.find({}, {
        limit: 5
    }, function(err, docs) {
        if (err) {
            res.send('connect error');
        } else {
            res.json(docs);
        }
    });
});
// When punched by the employee
function insertRecords(req, res) {
    var sid = req.cookies.sessionid;
    var timeNow = new Date().getTime();
    var records = db.get('records');
    var users = db.get('users');
    var delegation = db.get('delegation');
    var session = db.get('session');
    var jsonData = {};
    session.findOne({sessionid: sid}, function(err, sdocs) {
        var uid = sdocs.userid;
        var cid = sdocs.compid;
        var query = {userid: uid, outDate: {$exists: false}};
        records.findOne(query, function(err, docs) {
            if (!err) {
                console.log(docs);
                if (docs) {
                    docs.outDate = timeNow;
                    console.log(docs);
                    records.update({userid: uid, outDate: {$exists: false}}, docs, function(err, records) {
                        if (err) {
                            res.send(err.toString());
                        } else {
                            users.findOne({userid: uid}, function(err, users) {
                                console.log(users);
                                delete users.paassword;
                                jsonData.user = users;
                                jsonData.delegate = false;
                                delegation.find({userid: uid}, function(err, dels) {
                                    if (dels && dels.length > 0) {
                                        jsonData.delegate = true;
                                    }
                                    res.render('staff/staff_main', jsonData);
                                });
                            });
                        }
                    });
                } else {
                    var insertDoc = {userid: uid, compid: cid, inDate: timeNow, hourlyRate: 8.75, remark: "test"};
                    dbfunction.newDocWithIncId("records", "reportid", insertDoc, db, function(err, docs) {
                        if (err) {
                            res.send('Fail to punch, try again');
                        } else {
                            users.findOne({userid: uid}, function(err, users) {
                                console.log(users);
                                delete users.paassword;
                                jsonData.user = users;
                                jsonData.delegate = false;
                                delegation.find({userid: uid}, function(err, dels) {
                                    if (dels && dels.length > 0) {
                                        jsonData.delegate = true;
                                    }
                                    res.render('staff/staff_main', jsonData);
                                });
                            });
                        }
                    });
                }
            } else {
                res.send('Can not connect to db');
            }
        });
    });
}

function deleteRecords(req, res) {
    var rid = parseInt(req.params.rid);
    var records = db.get('records');
    var query = {reportid: rid};
    records.remove(query, function(err, docs) {
        if (err) {
            res.send('<p>Fail to delete</p>');
        } else {
            records.findOne({reportid: rid}, function(err, docs) {
                res.send('<p>Successfully delete</p>');
            });
        }
    });
}

//While updating datas in the database, we need to update the information that input
function updateRecords(req, res) {
    var rid = parseInt(req.params.rid);
    var starttime = new Date().getTime();
    var endtime = new Date().getTime();
    var records = db.get('records');
    records.update({
        reportid: rid
    }, {
        "$set": {
            "inDate": starttime,
            "outDate": endtime
        }
    }, function(err, docs) {
        if (err) {
            res.end('<p>Fail to update</p>');
        } else {
            res.end('<p>Successfully update</p>');
        }
    });
}


function searchRecords(req, res) {
    var starttime = Date.parse(req.body.startdate);
    var endtime = Date.parse(req.body.enddate);
    var userid = req.params.uid;
    var records = db.get('records');
    var query = {inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid};
    records.find(query, {limit: 30}, function(err, docs) {
        if (err) {
            res.send('System busy, try again!');
        } else {
            jsonData = {};
            jsonData.reports = [];
            docs.forEach(function(doc, index) {
                var report = {};
                report.reportid = doc.reportid;
                report.intime = doc.inDate;
                report.outtime = doc.outDate;
                report.hourlyrate = doc.hourlyRate;
                jsonData.reports.push(report);
            });
            db.get("users").findOne({
                userid: 　userid
            }, function(err, docs) {
                if (err) {
                    res.send('Can not get username');
                } else {
                    jsonData.username = docs.name;
                    jsonData.userid = userid;
                }
                jsonData.tr = res.__; //What does this mean?
                res.render('user_report', jsonData);
            });
        }
    });
}

function showRecords(req, res) {
    console.log("showRecords");
    var userid = req.params.uid;
    console.log(userid);
    var records = db.get('records');
    var jsonData = {};
    var query = {
        userid: userid
    };
    records.find(query, function(err, docs) {
        if (err) {
            res.send('System busy, try again!');
        } else {
            jsonData.reports = [];
            docs.forEach(function(doc, index) {
                var report = {};
                report.reportid = doc.reportid;
                report.intime = doc.inDate;
                report.outtime = doc.outDate;
                report.hourlyrate = doc.hourlyRate;
                jsonData.reports.push(report);
            });
            db.get("users").findOne({
                userid: 　userid
            }, function(err, docs) {
                if (err) {
                    res.send('Can not get username');
                } else {
                    jsonData.username = docs.name;
                    jsonData.userid = userid;
                }
                jsonData.tr = res.__; //What does this mean?
                res.render('user_report', jsonData);
            });
        }
    });
}

router.get('/records_punch', insertRecords);
router.get('/records_delete/:rid', deleteRecords);
router.post('/records_search', searchRecords);
router.get('/records_show/:uid', showRecords)
router.get('/records_update/:rid', updateRecords);

router.insertRecords = insertRecords;
router.deleteRecords = deleteRecords;
router.searchRecords = searchRecords;
router.updateRecords = updateRecords;

module.exports = router;
