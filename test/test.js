var assert = require('assert');
var usermodule = require('../usermodule');

var um = new usermodule();

describe('usermodule', function(){
    describe('#addUser()', function(){
        it('shoud insert a user into the database', function(done){
            var userObj = {
                userid: 'romanchelsea',
                password: 'satosumire'
            };

            um.addUser(userObj, )
        })
    })
})
