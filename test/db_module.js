var assert = require('assert');
var DBModule = require('../db_module');

describe("DBModule", function(){

    var db = new DBModule({
        schemaName: 'testuser',
        idName: 'testid'
    });

    describe('#requireModule', function(){

        it('should require a module', function(){
            var module = db.requireModule('usermodule');
            assert.equal(!!module, true);
            assert.equal(typeof module.addUser, 'function');
            
        });

    });

    describe("#drop", function(){

        it("should drop db." + db.schemaName, function(done){

            db.drop(function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc, true);
                done();
            });
            
        });

    });

    describe("#insert", function(){
        it("should insert three docs to db." + db.schemaName, function(done){
            db.insert([{testid:1, name:"Q"},{testid:2, name:"E"},{testid:2, name:"E"}], function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc.length, 3);
                assert.equal(doc[0].testid, 1);
                assert.equal(doc[0].name, "Q");
                assert.equal(doc[1].testid, 2);
                assert.equal(doc[1].name, "E");
                assert.equal(doc[2].testid, 2);
                assert.equal(doc[2].name, "E");
                done();
            });
        });

    });

    describe("#delete", function(){
        it('should delete one doc in db.' + db.schemaName, function(done){

            db.delete({testid:1}, function(err, deleteNum){
                if(err)
                    throw err;
                assert.equal(deleteNum, 1);
                done();

            });

        });
        it('should delete two docs in db.' + db.schemaName, function(done){
            db.delete({testid:2}, function(err, deleteNum){
                if(err)
                    throw err;
                assert.equal(deleteNum, 2);
                done();

            });
            
        });
    });

    describe("#updateOne", function(done){

        it('should add a new doc into db.' + db.schemaName, function(done){
            db.updateOne({testid:1}, { $set: { testid:1, name:"Q" } }, { upsert:true },function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc.testid, 1);
                assert.equal(doc.name, "Q");
                done();
            });
        });

        it('should add another new doc into db.' + db.schemaName, function(done){
            db.updateOne({testid:1}, { $set: { testid:2, name:"E" } }, { upsert:true },function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc.testid, 2);
                assert.equal(doc.name, "E");
                done();
            });
        });

        it('should update doc on db.' + db.schemaName, function(done){
            db.updateOne({testid:1}, { $set: { name:"E" } }, { upsert:true },function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc.testid, 1);
                assert.equal(doc.name, "E");
                done();
            });
        });
    });

    describe('#update', function(){
        it('should update 2 docs at the same time', function(done){
            db.update({name:'E'}, { $set : {age: 19} }, function(err, num){
                if(err)
                    throw err;
                assert.equal(num, 2);
                done();
            });

        });
    });
    
    describe('#aggregate', function(){
        it('should count the sum age of existing users', function(done){
            db.aggregate([{
                $group: {
                    _id : "null",
                    sumAge : {
                        $sum : "$age"
                    }
                }
            }], function(err, docs){
                if(err)
                    throw err;
                assert.equal(docs[0].sumAge, 19*2);
                done();
            });
        });
    });

    describe('#loadById', function(){
        it('should load a doc with specific id which defined in module', function(done){

            db.loadById(1, function(err, doc){
                if(err)
                    throw err;
                assert.equal(doc.testid, 1);
                assert.equal(doc.name, 'E');
                assert.equal(doc.age, 19);
                done();
            });

        });
    });

    describe('#closeDb', function(){

        it('should close db', function(){
            db.closeDb();
            assert.equal(db.db, undefined);

        });
    });

});
