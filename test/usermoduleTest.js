var assert = require('assert');
var usermodule = require('../usermodule');

var monk = require('monk');
var um = new usermodule();

describe('Usermodule', function(){

    describe('#drop', function(){

        it('should drop collection', function (done) {
            um.db.get('users').drop(function(err, droped){
                if(err)
                    throw err;
                assert.equal(droped, true);
                done();
            });
        });

    });

    describe('#addUser()', function(){
        it('should add a user into the database without error...', function(done){
            var userObj = {
                userid: "romanwang888",
                password: "wxw911024",
                name: "Xiongwei Wang",
                createDate: '2015-07-13',
                sex: true,
                email: 'romanwang888@gmail.com',
                address: '1827 W6 ST|BROOKLYN|NY|11220',
                compid: 345,
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

            um.addUser(userObj, function(err, doc){
                assert.equal(!!err, true);
                assert.equal(err.message, "User already exists!");

                done();
            });
        });
    });

    describe('#SearchUser', function(){

        it('should get all users that contains the searched term...', function(done){
            var uid = "iongw";
            var cid = '345';
            um.searchUser(uid, cid, function(err, doc){

                // console.log(JSON.stringify(doc));
                assert.equal(1, doc.length);
                assert.equal(doc[0].name, "Xiongwei Wang");
                assert.equal(doc[0].compid, cid);
                done();
            });
        });
    });

    describe('#GetAllUsers', function(){
        it('should get all users from the database...', function(done){
            query = {curRate: 15};

            um.getAllUsers(query, function(err, doc){
                assert.equal(doc.length, 2);
                done();
            })
        });
    });

    describe('#GetUserInfo', function(){
        it('should get the info of the specified user...', function(done){
            uid = "xming0819";

            um.getUserInfo(uid, function(err, doc){
                assert.equal(doc.userid, uid);
                done();
            })
        });
    });

    describe('#ChangeUser', function(){
        it('should update the info of the user with the given info...', function(done){
            var userObj = {
                userid: "haloroman",
                name: "Roman Wang Junior",
                createDate: "1991-10-24",
                password: "123123123",
                sex: true,
                email: "romanwang888@gmail.com",
                address: "1037 Luoyu Road|Wuhan|Hubei|430074",
                compid: 22,
                tel: "15007161628",
                curRate: 88,
                owner: false,
                remark: "This is the remark...",
                avatar: "http://example.com"
            };

            var uid = "xming0819";

            um.getUserInfo(uid, function(err, doc){
                userObj._id = doc._id;

                um.changeUser(userObj, function(err, doc){
                    assert.equal(!!doc, 1);
                    done();
                });
            });
        });
    });

    describe('#DeleteUser', function(){
        it('should delete the specified user from the database...', function(done){
            var uid = "romanwang";

            um.getUserInfo(uid, function(err, doc){
                var _id = doc._id;

                um.deleteUser(_id, function(err, doc){
                    assert.equal(!!doc, true);
                    done();
                });
            });
        });
    });
});
