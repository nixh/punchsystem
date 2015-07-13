var assert = require('assert');
var rModule = require('../recordsModule');
var rm = new rModule();

describe('RecordModule', function(){
    describe('#punch(userid, callback)', function(){
        it('should insert a records to db', function(done){
            rm.punch('LoginName_2', function(pp){
		//assert('function', typeof pp);
                pp.success(function(doc){ assert.equal('LoginName_2', doc.userid); done(); });
            });
		
        });
    });
});
