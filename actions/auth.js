var Q = require('q');
var AuthModule = require('../lib/module/authModule');
var am = new AuthModule();

var auth = {}

var recordsModule = require('../reportModule');

auth.punch = {
    type: 'api',
    execute: function(req, res, next) {
    }
}

auth.getKey = {
    type: 'api',
    execute: function(req, res, next) {
        var code = req.body.signiture;
        return am.getAuthKey(code).then(function(key){
            return {success: true, key:key};
        });
    }
}

auth.disableKey = {
    type: 'api',
    execute: function(req, res, next) {
        var authkey = req.auth_key;
        return am.removeAuthKey(authkey).then(function(valid){
            var ret = {};
            if(valid) {
                ret.status = 'success';
                ret.msg = "";
            } else {
                ret.status = 'fail';
                ret.msg = "";
            }
            return ret;
        });
    }
}

module.exports = auth;
