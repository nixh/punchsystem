var assert = require('assert');
var reportModule = require('../lib/module/reportModule');
var monk = require('monk');
var rm = new reportModule();

describe('Report Module unit Tests', function() {

	// describe('#punch(userid)', function() {
	//     it('should insert or update a record in the report documentation', function(testDone) {
	//     	var userid = "LoginName_1";
    //         rm.punch(userid).then(function(rec) {
    //             console.log(rec);
    //         }).done(function() {
	// 			testDone();
	// 		});
	//     });
	// });

	// describe('#updateRecord(_id)', function() {
	// 	it('should update the inDate/outDate a record in the report documentation', function(testDone) {
	// 		var newTime = {};
	// 		newTime.inDate = new Date(2015, 7, 29, 10).getTime();
	// 		newTime.outDate = new Date(2015, 7, 29, 18).getTime();
	// 		var _id = '55b257003b334b2f1c2248ed';
	// 		rm.updateRecord(_id, newTime).then(function(newRecord) {
	// 			console.log(newRecord);
	// 		}).done(function() {
	// 			testDone();
	// 		});
	// 	});
	// });

	describe('#recentRecords(idObj)', function() {
		it('should show the recent records of a specific user', function(testDone) {
			var userid ='LoginName_1';
			var idObj = {};
			idObj.sessionid = 'a5ec2a30-3218-11e5-b06f-cf2c78c304eb';
			rm.recentRecords(idObj).then(function(recs) {
				console.log(recs);
			}).done(function() {
				testDone();
			});
		});
	});

	describe('#searchRecords(userid, startDate, endDate, length_limit)', function() {
		it('should search the records of a specific user by time range', function(testDone) {
			var userid = 'LoginName_1';
			var startDate = new Date(2015, 6, 1).getTime();
			var endDate = new Date(2015, 8, 30).getTime();
			rm.searchRecords(userid, startDate, endDate).then(function(recs) {
				console.log(recs);
			}).done(function() {
				testDone();
			});
		});
	});

	// describe('#showUsersForDelegate', function () {
	// 	it('should show delegate status of users of a specific company', function(testDone) {
	// 		var sessionid = 'a5ec2a30-3218-11e5-b06f-cf2c78c304eb';
	// 		rm.showUsersForDelegate(sessionid).then(function(ret) {
	// 			console.log(ret);
	// 		}).done(function() {
	// 			testDone();
	// 		});
	//
	// 	});
	// });

	// describe('#delegate(userid, flag, sessionid)', function() {
	// 	it('should authorize or cancel delegation of a specific user', function(testDone) {
	// 		var userid = 'LoginName_8';
	// 		var flag = 1;
	// 		sessionid = 'a5ec2a30-3218-11e5-b06f-cf2c78c304eb';
	// 		rm.delegate(userid, flag, sessionid).then(function(delegate) {
	// 			console.log(delegate);
	// 		}).done(function() {
	// 			testDone();
	// 		});
	// 	});
	// });

	// describe('#getReportsByWeek(sessionid, startDate, endDate)', function() {
	// 	it('should calculate the punch reports of a specific user by week', function(testDone) {
	// 		var sessionid = 'a5ec2a30-3218-11e5-b06f-cf2c78c304eb';
	// 		var startDate = new Date(2015, 6, 6).getTime();
	// 		var endDate = new Date(2015, 6, 13).getTime();
	// 		rm.getReportsByWeek(sessionid, startDate, endDate).then(function(reports) {
	// 			console.log(reports);
	// 		}).done(function() {
	// 			testDone();
	// 		});
	// 	});
	// });

	// describe('#getReportsByMonth(sessionid, startDate, endDate)', function() {
	// 	it('should calculate the punch reports of a specific user by Month', function(testDone) {
	// 		var sessionid = 'a5ec2a30-3218-11e5-b06f-cf2c78c304eb';
	// 		var startDate = new Date(2015, 6, 6).getTime();
	// 		rm.getReportsByMonth(sessionid, startDate).then(function(reports) {
	// 			console.log(reports[0]);
	// 		}).done(function() {
	// 			testDone();
	// 		});
	// 	});
	// });
});
