var Q = require('q');
var utils = require('../lib/common/utils');
var AuthModule = require('../lib/module/authModule');
var am = new AuthModule();

var auth = {}

var recordsModule = require('../reportModule');

var signer = utils.crypto.signer();

auth.punch = {
    type: 'api',
    execute: function(req, res, next) {
        var punchKey = req.params.punchkey;
        var authKey = req.headers['auth_key'];
        var userid = req.body.userid;
        var parts = punchKey.split('.');
        var key = utils.unsafeBase64(parts[1]);
        try {
            signer.unsign(parts[0] + "." + key);
        } catch(err) {
            throw new Error('invalid_punchkey');
        }
    }
}

auth.recentRecords = {
    type: 'api',
    execute: function(req, res, next) {
        var userid = req.body.userid;

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
