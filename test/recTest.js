var assert = require('assert');
var rModule = require('../recModule');
var monk = require('monk');
var rm = new rModule();
//var rm = new rModule({db: monk('localhost/test')});
// var db = new rModule();

describe('ReModule', function(){
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
    //
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
    //
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
    //
    // describe('#updateRecords(reportid, newRec, callback)', function() {
    //     it('should update a record of specific user', function(done){
    //         var query = {_id: "55a3d4a2e18d51d8e25aefb8"};
    //         var startDate = new Date().getTime();
    //         var endDate = new Date().getTime();
    //         var newRec = {startDate: startDate, endDate: endDate};
    //         rm.updateRecords(query, newRec, function(msg) {
    //             assert.equal(msg, true);
    //         });
    //         done();
    //     });
    // });

    describe('#getWagesByWeek(query, callback)', function() {
        it('should calculate the wages of users by week or more', function(done) {
            var compid = 49;
            var startDate = new Date(2015, 5, 9).getTime();
            var endDate = new Date(2015, 6, 21).getTime();
            var query = { userid : userid, startDate : startDate, endDate : endDate };
            //console.log(query);
            rm.getWagesByWeek(query, function(jsonData) {
                console.log(jsonData);
                done();
            });
            //done();
        });
    });
});
