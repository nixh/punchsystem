var Q = require('q');
var utils = require('../lib/common/utils');
var AuthModule = require('../lib/module/authModule');
var factory = require('../lib/module/moduleFactory');
var am = new AuthModule();
var config = require('../lib/common/config')();
var moment = require('moment');

var auth = {}

var recordsModule = require('../reportModule');

var signer = utils.crypto.signer();

auth.punch = {
    type: 'api',
    execute: function(req, res, next) {
        var punchKey = req.params.punchkey;
        var authKey = req.header['auth_key'];
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
        var beginDate = moment(req.body.beginDate, 'YYYY-MM-DD');
        var endDate = moment(req.body.endDate, 'YYYY-MM-DD');
        var userid = req.body.userid;
        var authKey = req.header['auth_key'];
        var length_limit = req.body.rec_length 
                           || config.get('app.config->recentRecords.limit') 
                           || 5;
        return am._private.existsAuthKey(authKey).then(function(validKey){
            if(!validKey)
                throw new Error('invalid_authkey');
            var rm = factory.get('reportModule');
            return rm.searchRecords(userid, beginDate, endDate, length_limit)
                     .then(function(records){
                         var data = records.map(function(r){
                             return {
                                 inDate: r.inDate,
                                 outDate: r.outDate
                             };
                         });
                         return { data: data, status:'success' };
                     });
        });

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
