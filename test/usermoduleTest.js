var assert = require('assert');
var monk = require('monk');
var util = require('../lib/common/utils');
var usermodule = require('../lib/module/userModule');
var dbm = require('../lib/common/db');
var Q = require('q');
var um = new usermodule();


describe('Usermodule', function(){
    describe("#Validate", function() {
        it('should make the input userObj valid...', function() {
            var userObj = {
                userid: 'roman',
                password: '19911024',
                name: 'Xiongwei Wang',
                compid: '20',
                sex: 1,
                title: 'Dr.',
                malAttr: 'shit'
            };

            um._private.validate(util.wrap(userObj)).then(function(res) {
                assert.equal(malAttr, undefined);
            });
        });
    });


    describe('#drop', function(){
        it('should drop the specified column...', function(done) {
            dbm.use(dbm.dropIfExists('users')).then(function(res) {
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

            um.addUser(userObj).then(function(res) {
                assert.equal(res, userObj);
                done();
            });
        });

        it('cannot add a replicated user...', function(done){
            var userObj = {
                userid: "romanwang888",
                password: "changed",
                name: "El Roman Guapo",
                createDate: '2015-08-03',
                sex: true,
                email: 'xw733@gmail.com',
                address: '1648 80 ST|BROOKLYN|NY|11220',
                compid: 435457,
                tel: "213325479",
                curRate: 15,
                owner: false,
                remark: "This records should be inserted failed.",
                avatar: "https://romanwang.com"
            };

            assert.throws(um.addUser(userObj), Error);
            done();
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
                spouse: "Secret Kara"
            };

            um.addUser(userObj).then(function(res) {
                assert.equal(res, userObj);
                done();
            });
        });
    });

    describe('#SearchUser', function(){

        it('should get all users that contains the searched term...', function(done){
            var name = "ng08 ";
            var cid = 22;

            um.searchUser(name, cid).then(function(res) {
                assert.equal(res[0].userid, "romanwang888");
                assert.equal(res[0].compid, 345);
                done();
            });
        });

        it.skip('should get all users that contains the searched term, again...', function(done) {
            var userid = "ng08";
            var cid = 22;
            done();
        });
    });

    describe('#GetAllUsers', function(){
        it('should get all users from the database...', function(done){
            query = {curRate: 15};

            um.getAllUsers(query).then(function(res) {
                assert.equal(res[0].userid, "romanwang888");
                done();
            });
        });
    });

    describe('#GetUserInfo', function(){
        it('should get the info of the specified user...', function(done){
            uid = "xming0819";
            um.getUserInfo(uid).then(function(res) {
                assert.equal(res.userid, uid);
                done();
            });
        });
    });

    describe('#ChangeUser', function(){
        it('should update the info of the user with the given info...', function(done){
            var userObj = {
                userid: "xming0819",
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


            um.changeUser(userObj).then(function(res) {
                assert.equal(res.name, "Roman Wang Junior");
                done();
            });
        });
    });

    describe('#DeleteUser', function(){
        it('should delete the specified user from the database...', function(done){
            var uid = "romanwang888";

            um.getUserInfo(uid).then(function(res) {
                um.deleteUser(res._id).then(function(res) {
                    console.log(res);
                    assert.equal(res, true);
                    done();
                });
            });

        });
    });
});
