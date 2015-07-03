var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('mongodb://localhost:27017/punchsystem');

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

// *******************
var insertRecords = function() {
	return function(req, res) {
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
		records.insert({"userid": uid, "compid": cid, "inDate": time_1, "outDate": time_2, "hourlyRate": 8.75, "remark": "test"},
					function(err, docs) {
						if (err) {
							res.end('<p>Fail to insert</p>');
						} else {
							res.end('<p>Successfully insert</p>');
						}
					});
	}
}



var deleteRecords = function() {
	return function(req, res) {
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
	}
}

//While updating datas in the database, we need to update the information that input
var putRecords = function() {
	return function(req, res) {
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
	}
}

var searchRecords = function(req, res) {
	return function(req, res) {
		var starttime = 1435893899525;
		var endtime = 1444893899525;
		//var db = req.db;
		var records = db.get('records');
		var jsonData = {};
		jsonData.records = db.records.find({intime : {"$gte" : starttime} , outtime : {"$lte:": endtime}}).toArray();
	}
}
router.get('/records_insert', insertRecords());
router.get('/records_delet', deleteRecords());
router.get('/records_search', searchRecords());
router.get('/records_update', putRecords());



// *******************

router.get('/test', function(req, res, next){
	
	res.render('test/prac', { name:"Yong D Liu"});
});

router.get('/login', function(req, res, next){
	
	res.render('login');
});

router.get('/staff', function(req, res, next){
	
	res.render('staff/staff_main', {
		users: {
			company_userid : "company_userid",
			name : "name",
			createDate: "Date",
			password: "password", // Encrypted Text
			sex : true,
			email : 1231425
		}
	});
});

router.get('/staff', function(req, res, next){
	
	res.render('staff/staff_setting', {emailReportData:['one', 'two', 'three']});
});

router.get('/staff', function(req, res, next){
	
	res.render('staff/staff_delegate', {
		dataURL : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAACcCAYAAACKuMJNAAAABmJLR0QA/wD/AP+gvaeTAAADnUlEQVR4nO3d0Y7DJhRF0abq//9y+lq5Ui0EbBN3rdeJmZnoCF1hLny+3+/3D4j8+fQfwP+LwJESOFICR0rgSAkcKYEjJXCkBI6UwJESOFICR0rgSAkcKYEjJXCkBI6UwJESOFJ/rR7w8/msHvI/rW7JuP79o+Pf/f/X8VZ/frXV368ZjpTAkRI4UstruKvdNVb9/Oh4o///7s/f2V0jmuFICRwpgSO1vYa7Gq0RZtfBrs/frWvd/b7d63Szdn+/s8xwpASOlMCRymu42mzNdTVa440+/3ZmOFICR0rgSL2uhlu932x2P9rudb1fY4YjJXCkBI5UXsOdVqPsrslGx5ut6U77fq/McKQEjpTAkdpew9V9lKPraKPrbKv3w83WXPX3O8sMR0rgSAkcqeU13NPrQKv3u43WXLvPAnn6+51lhiMlcKQEjtTj++Hq89RWv5uc7WHYvR/utB4LMxwpgSMlcKTyd6mz61h3P599l3q1ex1u9vevPi9vd01nhiMlcKQEjlR+xu/ofrO7nz9d06yuEWfHdz4c/IPAkRI4Uo/ftbV6T399N1U9fn2+nbu2+GkCR0rgSH2+mxdiTrvXoD6jd/W71Duz63bepfIqAkdK4Ehtr+H+9Qsna7Ld63Z3nx+1u0fh1961muFICRwpgSO1/V3q7rM+7j5/5/Seg1G79+fNMsOREjhSAkdq+/lwu9+FzvZIrLb7DN/TxhtlhiMlcKQEjtTx63Cz469edzrtvLVRs9/XLDMcKYEjJXCkjjsfbvb51T0As5+/qs/LO40ZjpTAkRI4Ust7Gk7brzaqvndhd41b32txxwxHSuBICRyp/K6t3X2e9R7+1e9i6/2D9bqdGY6UwJESOFKP35c626Ow+8zb2ed/vadiNTMcKYEjJXCk8vPhdjt9P9zoePWZyHoaeBWBIyVwpB6/a2vW6rM27sZf3VNwWk/EbmY4UgJHSuBI5Xfez9rdM/H083d29zxYh+NVBI6UwJE6vqehronuapp6/1v9blRfKq8icKQEjtTjPQ27zfZlnr5OtnqdzTocryJwpASO1OtquN3no+3evzZqd0+EdTh+msCREjhSeQ1X76EfXYer7+6q71l4+p4HMxwpgSMlcKTyexpWe/o+1qfvWbhz2tExZjhSAkdK4Ei97nw4zmaGIyVwpASOlMCREjhSAkdK4EgJHCmBIyVwpASOlMCREjhSAkdK4EgJHCmBIyVwpASO1N9n/h5hPIuV/QAAAABJRU5ErkJggg=="
	});
});

router.get('/supervisor', function(req, res, next){
	
	res.render('supervisor/supervisor_main', {
		users: {
			company_userid : "company_userid",
			name : "name",
			createDate: "Date",
			password: "password", // Encrypted Text
			sex : true,
			email : 1231425
		}
	});
});

router.get('/supervisor', function(req, res, next){
	
	res.render('supervisor/supervisor_delegate', {
		delegates:[
			{
				name: "abc1",
				id: 1,
				isDelegate: true
			},
			{
				name: "abc2",
				id: 2,
				isDelegate: false
			},
			{
				name: "abc3",
				id: 3,
				isDelegate: false
			},
			{
				name: "abc4",
				id: 4,
				isDelegate: true
			}
		]
	});
});

module.exports = router;
