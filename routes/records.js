var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');

router.get('/testdb', function(req, res) {
	var records = db.get('records');
	records.find({}, {limit: 5}, function(err, docs) {
		if (err) {
			res.send('connect error');
		} else {
			res.json(docs);
		}
	});
});

var insertRecords = function(req, res) {
		var uid = 1;
		var cid = 29;
		var timeNow = new Date().getTime();
		var records = db.get('records');
		records.find({userid: uid, outDate: {$exists: false}}, function(err, docs) {
			if (!err) {
				console.log(docs.length);
				if (docs !=  0) {
					docs[0].outDate = timeNow;
					//res.json(docs);
					records.update({userid: uid, outDate: {$exists: false}}, docs[0], function(err, docs) {
						if (err) {
							res.send('Fail to punch');
						} else {
							res.send('Successfully punched, updated');
						}
					});
				} else {
					var insertDoc = {userid: uid, compid: cid, inDate: timeNow, hourlyRate: 8.75, remark: "test"};
					dbfunction.newDocWithIncId("records", "reportid", insertDoc, db, function(err, docs) {
						if (err) {
							res.send('Fail to punch, try again');
						} else {
							res.send('Successfully punched, insert new');
						}
					});
				}
			} else {
				res.send('Can not connect to db');
			}
		});
};

var deleteRecords = function(req, res) {
		var rid = 2019;
		//var db = req.db;
		var records = db.get('records');
		records.remove({reportid: rid}, 
					  function(err, docs) {
				  		if (err) {
				  			res.end('<p>Fail to delete</p>');
				  		} else {
				  			res.end('<p>Successfully delete hahah</p>');
				  		}
				  });
};

//While updating datas in the database, we need to update the information that input
var updateRecords = function(req, res) {
	var rid = 2019;
	var starttime = new Date().getTime();
	var endtime = new Date().getTime();
	//var db = req.db;
	var records = db.get('records');
	records.update({reportid: rid}, {"$set" : {"inDate": starttime, "outDate": endtime}}, 
				  function(err, docs) {
				  	if (err) {
				  		res.end('<p>Fail to update</p>');
				  	} else {
				  		res.end('<p>Successfully update</p>');
				  	}
				  });
};

var searchRecords = function(req, res) {
	var starttime = 1435893899525;
	var endtime = 1444510800001;
	var records = db.get('records');
	// 
	var jsonData = {};
	var userid = 3;
	records.find({inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid}, {limit: 30}, function(err, docs) {
		if (err) {
			res.send('Unable to search Records!');
		} else {
			jsonData.reports = [];
			docs.forEach(function(doc, index){
			var report = {};
			report.intime = doc.inDate;
			report.outtime = doc.outDate;
			report.hourlyrate = doc.hourlyRate;
			jsonData.reports.push(report);
		});
		//jsonData.username = db.users.findOne({userid:　userid}, {"name": 1});

		db.get("users").findOne({userid:　userid}, {"name": 1}, function(err, docs) {
			jsonData.username = docs.name;
		});

		jsonData.tr = res.__;
		res.render('user_report', jsonData);
		//res.json(docs);
		}
	});
};
router.get('/records_punch', insertRecords);
router.get('/records_delete', deleteRecords);
router.get('/records_search', searchRecords);
router.get('/records_update', updateRecords);

router.insertRecords = insertRecords;
router.deleteRecords= deleteRecords;
router.searchRecords = searchRecords;
router.updateRecords = updateRecords;
module.exports = router;