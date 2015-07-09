var assert = require("assert");
var usermod = require('../usermodule');

describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});

describe('RecordModule', function(){
    describe('#punch(userid, callback)', function(){
        it('should insert a records to db', function(done){
            rm.punch('LoginName_2', function(pp){
		assert('function', typeof pp);
                pp.success(function(doc){ assert.equal('LoginName_2', doc.userid); done(); });
            });
		
        });
    });
});

