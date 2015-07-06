var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');

var insertRecords = function(req, res) {
		/*
		var uid = req.body.uid;
		var cid = req.body.cid;
		var rid = req.body.rid;
		*/
		var uid = 2357;
		var cid = 8888;
		var rid = 1234567;
		var time_1 = new Date().getTime();
		var time_2 = new Date().getTime();
		//var db = req.db;
		var records = db.get('records');
		records.insert(
			{"userid": uid, "compid": cid, "inDate": time_1, "outDate": time_2, "hourlyRate": 8.75, "remark": "test"},

			function(err, docs) {
						if (err) {
							res.end('<p>Fail to insert</p>');
						} else {
							res.end('<p>Successfully insert</p>');
						}
					});
};



var deleteRecords = function() {
		var uid = 928;
		var cid = 15;
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
var putRecords = function() {
	var uid = 928;
	var cid = 15;
	var rid = 2019;
	var starttime = new Date().getTime();
	var endtime = new Date().getTime();
	//var db = req.db;
	var records = db.get('records');
	records.update({userid: uid, compid: cid, reportid: rid}, {"$set" : {"inDate": starttime, "outDate": endtime}},
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
	var endtime = 1444893899525;
	//var db = req.db;
	var records = db.get('records');
	var jsonData = {};
	jsonData.records = db.records.find({intime : {"$gte" : starttime} , outtime : {"$lte:": endtime}}).toArray();
};
router.get('/records_insert', insertRecords);
router.get('/records_delet', deleteRecords);
router.get('/records_search', searchRecords);
router.get('/records_update', putRecords);

router.insertRecords = insertRecords;
router.deleteRecords= deleteRecords;
router.searchRecords = searchRecords;
router.putRecords = putRecords;
module.exports = router;
