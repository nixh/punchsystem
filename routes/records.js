var express = require('express');
var router = express.Router();
var dbfunction = require('../db/db');
var mo = require('moment');
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

function insertRecords(req, res) {
	var uid = 1;
	var cid = 29;
	var timeNow = new Date().getTime();
	var records = db.get('records');
	var query = {userid: uid, outDate: {$exists: false}};
	records.find(query, function(err, docs) {
		if (!err) {
			console.log(docs.length);
			if (docs.length !==  0) {
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

function deleteRecords(req, res) {
	var rid = req.params.rid;
	console.log(rid);
	var records = db.get('records');
	var query = {reportid: rid};
	records.remove(query, function(err, docs) {
  		if (err) {
  			res.send('<p>Fail to delete</p>');
  		} else {
  			res.send('<p>Successfully delete hahah</p>');
  		}
  	});
};

//While updating datas in the database, we need to update the information that input
function updateRecords(req, res) {
	var rid = req.params.rid;
	var starttime = new Date().getTime();
	var endtime = new Date().getTime();
	//var starttime = Date.parse(req.body.startdate);
	//var endtime = Date.parse(req.body.enddate);
	var records = db.get('records');
	records.update({reportid: rid}, {"$set" : {"inDate": starttime, "outDate": endtime}}, function(err, docs) {
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
	var records = db.get('records');
	var jsonData = {};
	var userid = 1;
	var query = {inDate : {"$gte" : starttime} , outDate : {"$lte": endtime}, userid: userid};
	records.find(query, {limit: 30}, function(err, docs) {
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
router.post('/records_search', searchRecords);
router.get('/records_update', updateRecords);

router.insertRecords = insertRecords;
router.deleteRecords = deleteRecords;
router.searchRecords = searchRecords;
router.updateRecords = updateRecords;
module.exports = router;
