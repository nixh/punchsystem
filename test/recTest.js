var assert = require('assert');
var rModule = require('../recModule');
var monk = require('monk');
var rm = new rModule();
// var db = new rModule();

describe('ReModule', function(){
    describe('#Punch(userid, callback)', function() {

    });
    describe('#Search_Records(userid, su, callback)', function() {
        it('should search records of specific user', function(done){
            var query = {userid: 'LoginName_1'};
            var su = 1;
            rm.searchRecords(query, su, function(jsonData) {
                recs = jsonData.records;
                recs.forEach(function(rec, index) {
                    assert.equal(rec.userid, query.userid);
                });
                done();
            })
        });
    });
});
