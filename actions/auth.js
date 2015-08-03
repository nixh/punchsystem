var Q = require('q');
var utils = require('../lib/common/utils');
var AuthModule = require('../lib/module/authModule');
var factory = require('../lib/module/moduleFactory')();
var am = new AuthModule();
var config = require('../lib/common/config')();
var moment = require('moment');

var auth = {}

var signer = utils.crypto.signer();
var rm = factory.get('reportModule');

auth.punch = {
    type: 'api',
    execute: function(req, res, next) {
        var punchKey = req.params.punchkey;
        var authKey = req.header['auth_key'];
        var userid = req.body.userid;
        var parts = punchKey.split('.');
        var key = utils.unsafeBase64(parts[1]);
        var qrid = null;
        try {
            qrid = signer.unsign(parts[0] + "." + key);
        } catch(err) {
            throw new Error('invalid_punchkey');
        }
        return am.validQRCodeByUserId(qrid, userid).then(function(user){
            return rm.punch(user.userid);
        }).then(function(record){
            var punchOut = record.outDate !== null;
            var punchTime = punchOut ? record.outDate : record.inDate;
            return {
                status: 'success',
                data: {
                    punchOut: punchOut,
                    punchTime: punchTime
                }
            };
        });
    }
}

auth.searchRecords = {
    type: 'api',
    execute: function(req, res, next) {
        var beginDate = moment(req.body.beginDate, 'YYYY-MM-DD').valueOf();
        var endDate = moment(req.body.endDate, 'YYYY-MM-DD').valueOf();
        var userid = req.body.userid;
        var authKey = req.header['auth_key'];
        var length_limit = req.body.rec_length 
                           || config.get('app.config->recentRecords.limit') 
                           || 5;
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
        var authkey = req.body.auth_key;
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
