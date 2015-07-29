var assert = require('assert');
var rModule = require('../recModule');
var monk = require('monk');
var rm = new rModule();
//var rm = new rModule({db: monk('localhost/test')});
// var db = new rModule();

describe('ReModule unit Tests', function(){
    describe('#delegate(query, callback)', function() {
        it('should delegate supervisor authority to specific users', function(done) {
            var userid = 'LoginName_2';
            var compid = 5;
            var flag = true;
            var query = {userid : userid, compid : 5, flag : flag};
            rm.delegate(query, function(err, msg) {
                console.log(msg);
                done();
            });
            
        });
    });

    describe('#delegate(query, callback)', function() {
        it('should cancel delegate authority to specific users', function(done) {
            var userid = 'LoginName_2';
            var compid = 5;
            var flag = false;
            var query = {userid : userid, compid : 5, flag : flag};
            rm.delegate(query, function(err, msg) {
                console.log(msg);
                done();
            });
        });
    });

    // describe('#Punch(query, callback)', function() {
    //     it('should add a record to a specific user', function(done) {
    //         var query = {userid: 'LoginName_1'};
    //         var times = 11;
    //         for (var i = 1; i < times; i++) {
    //             var isOdd = (i % 2 == 0) ? false : true;
    //             rm.punch(query, function(err, record) {
    //                 var isIn = (record.outDate != null) ? false : true;
    //                 console.log(i);
    //                 assert.equal(isOdd, isIn);
    //             });
    //         }
    //         done();
    //     });
    // });

    // describe('#Search_Records(userid, su, callback)', function() {
    //     it('should search records of specific user', function(done){
    //         var query = {userid: 'LoginName_1'};
    //         var su = 1;
    //         rm.searchRecords(query, su, function(jsonData) {
    //             recs = jsonData.records;
    //             recs.forEach(function(rec, index) {
    //                 assert.equal(rec.userid, query.userid);
    //             });
    //             done();
    //         });
    //     });
    // });

    // describe('#deleteRecords(reportid, callback)', function() {
    //     it('should delete a record of specific user', function(done){
    //         var query = {};
    //         rm.getOneRecord(query, function(err, record) {
    //             rid = record._id;
    //             rm.deleteRecords(rid, function(msg) {
    //                 assert.equal(msg, true);
    //             });
    //         });
    //         done();
    //     });
    // });

    // describe('#updateRecords(reportid, newRec, callback)', function() {

    //     it('should update both the indate and the outdate of a record of a specific user', function(done){
    //         var userid = 'LoginName_1';
    //         var oriIndate = 1436443200000;
    //         var startDate = 1436443200009;
    //         var endDate = 1436443200011;
    //         var query = {userid: userid, inDate: oriIndate};
    //         var newRec = {inDate: startDate, outDate: endDate};
    //         rm.updateRecords(query, newRec, function(err, docs) {
    //             console.log(err);
    //             console.log(docs);
    //             assert.equal(docs.endDate, outDate);
    //         });
    //         done();
    //     });

    //     it('should update just the indate of a record of a specific user', function(done) {
    //         var userid = 'LoginName_1';
    //         var oriIndate = 1436450400000;
    //         var startDate = 1436450400001;
    //         var query = {userid: userid, inDate: oriIndate};
    //         var newRec = {inDate: startDate};
    //         rm.updateRecords(query, newRec, function(err, docs) {
    //             //console.log(docs);
    //             assert.equal(docs.inDate, startDate);
    //         });
    //         done();
    //     });

    //     it('should update just the outdate of a record of a specific user', function(done) {
    //         var userid = 'LoginName_1';
    //         var oriIndate = 1436446800000;
    //         var endDate = 1436450400221;
    //         var query = {userid: userid, inDate: oriIndate};
    //         var newRec = {outDate: endDate};
    //         rm.updateRecords(query, newRec, function(err, docs) {
    //             //console.log(docs);
    //             assert.equal(docs.outDate, endDate);
    //         });
    //         done();
    //     });
    // });

    // describe('#getWageOfUser(query, callback)', function() {
    //     it('should calculate the wages of users by week or more', function(done) {
    //         var userid = 49;
    //         var startDate = new Date(2015, 5, 9).getTime();
    //         var endDate = new Date(2015, 6, 21).getTime();
    //         var query = { userid : userid, startDate : startDate, endDate : endDate };
    //         //console.log(query);
    //         rm.getWageOfUser(query, function(jsonData) {
    //             console.log(jsonData);
    //             done();
    //         });
    //         //done();
    //     });
    // });

    // describe('#getWageByWeek(query, callback)', function() {
    //     it('should calculate the wages of users of a specific company by weeks or more', function(done) {
    //         var compid = 1;
    //         var startDate = new Date(2015, 6, 1).getTime();
    //         var endDate = new Date(2015, 6, 11).getTime();
    //         var query = { compid : compid, startDate : startDate, endDate : endDate };
    //         //console.log(query);
    //         rm.getWageByWeek(query, function(jsonData) {
    //             //console.log(jsonData);
    //             done();
    //         });
    //         //done();
    //     });
    // });

    // describe('#getWageByMonth(query, callback)', function() {
    //     it('should calculate the wages of users of a specific company by Month', function(done) {
    //         var compid = 1;
    //         var startDate = new Date(2015, 6, 1).getTime();
    //         var endDate = new Date(2015, 6, 31).getTime();
    //         var query = { compid : compid, startDate : startDate, endDate : endDate };
    //         //console.log(query);
    //         rm.getWageByMonth(query, function(jsonData) {
    //             //console.log(jsonData);
    //             done();
    //         });
    //         //done();
    //     });
    // });
});
