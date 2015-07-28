var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');
var logger = require('../../logger');
var ursa = require('ursa');
var Q = require('q');
var fs = require('fs');

module.exports = AuthModule;

dbm.setUrl('localhost/aps')

function AuthModule() {
}

AuthModule.prototype._private = {
    checkUser: function(userid) {
        logger.info('log id is %s', userid);
        return dbm.load('users', userid, 'userid');
    },
    checkPwd: function(pwd) {
        return function(user) {
            logger.info('users id is %j', user, {});
            if(!user)
                return Q(false);
            var password = utils.crypto.sha(pwd);
            return Q(password===user.password);
        }
    },
    newAuthKey: function() {
        var time = new Date().getTime();


        return dbm.use(dbm.insert('authkey', {}))
    }
};

AuthModule.prototype.login = function(userid, password) {
    return dbm.use(this._private.checkUser(userid),
            this._private.checkPwd(password));
};

AuthModule.prototype.getAuthKey = function(code) {
    var valid = utils.crypto.verify(config.get('clientAuthSig'), code);
    if(!valid)
        throw new Error('invalid_client_signiture');

}
