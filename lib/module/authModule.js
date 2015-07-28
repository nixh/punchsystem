var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');
var Q = require('q');

module.exports = Module;

function Module() {
}

Module.prototype._private = {
    checkUser: function(userid) {
        return dbm.load('users', userid, 'userid').call(this);
    },
    checkPwd: function(pwd) {
        return function(user) {
            if(!user)
                return Q(false);
            var password = utils.crypto.sha(pwd);
            return Q(password===user.password);
        }
    }

};

