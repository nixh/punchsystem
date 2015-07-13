var assert = require('assert');
var usermodule = require('../usermodule');

var monk = require('monk');
var um = new usermodule({db:monk('localhost/test')});

describe('Usermodule', function(){

    describe('#drop', function(){

        it('should drop collection', function (done) {
            um.db.get('users').drop(function(err, droped){
                if(err)
                    throw err;
                assert.equal(droped, true);
                done();
            })
        })

    });

    describe('#addUser()', function(){
        it('should add a user into the database without error...', function(done){
            var userObj = {
                userid: "romanwang",
                password: "wxw911024",
                name: "Xiongwei Wang",
                createDate: '2015-07-13',
                sex: true,
                email: 'romanwang888@gmail.com',
                address: '1827 W6 ST|BROOKLYN|NY|11220',
                compid: 175,
                tel: "9178035096",
                curRate: 15,
                owner: false,
                remark: "This records should be inserted successfully.",
                avatar: "http://romanwang.com"
            };

            um.addUser(userObj, function(err, doc){
                delete doc._id;
                assert.equal(userObj, doc);
                done();
            });
        });

        it('should add another user into the database even if there are irrelevant entries...', function(done){
            var userObj = {
                userid: "xming0819",
                password: "123123123",
                name: "Xing Ming",
                createDate: '2015-07-11',
                sex: false,
                email: 'xming0819@gmail.com',
                address: '1216 E Vista Del Cerro Dr.|TEMPE|AZ|85281',
                compid: 128,
                tel: "4806035416",
                curRate: 60,
                owner: false,
                remark: "This records should be inserted successfully.",
                avatar: "http://google.com",

                malAttr: "This attribute is not valid",
                boyfriend: "Roman Wang"
            };

            um.addUser(userObj, function(err, doc){
                delete doc._id;
                assert.equal(userObj, doc);
                done();
            });
        });

        it("won't add a replicated user into the database...", function(done){
            var userObj = {
                userid: "romanwang",
                password: "wxw911024",
                name: "Xiongwei Wang",
                createDate: '2015-07-13',
                sex: true,
                email: 'romanwang888@gmail.com',
                address: '1827 W6 ST|BROOKLYN|NY|11220',
                compid: 175,
                tel: "9178035096",
                curRate: 15,
                owner: false,
                remark: "This records should be inserted successfully.",
                avatar: "http://romanwang.com"
            };

            function e(){
                throw 'User already exists!';
            }

            um.addUser(userObj, function(err, doc){
                assert.throws(e, Error);
            });
        })
    });
});
