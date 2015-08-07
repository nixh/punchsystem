var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config')();
var logger = require('../../logger');
var Q = require('q');
var fs = require('fs');
var factory = require('./moduleFactory')();
module.exports = AuthModule;

function AuthModule() {
}

var authColName = 'authkeys';

AuthModule.prototype._private = {
    checkUser: function(userid) {
        return dbm.load('users', userid, 'userid');
    },
    checkPwd: function(pwd) {
        return function(user) {
            if(!user)
                return Q(false);
            var password = utils.crypto.sha(pwd);
            if(password === user.password) {
                return Q(user);
            }
            return Q(false);
        };
    },
    newAuthKey: function() {
        var ts = new Date().getTime();
        var key = utils.crypto.prvKeyEncript(ts.toString());
        return dbm.insert(authColName, {key:key});
    },
    removeAuthKey: function(key) {
        return dbm.deleteOne(authColName, {key:key});

    },
    existsAuthKey: function(key) {
        return [dbm.load(authColName, key, 'key'), function(keyDoc){
            if(!keyDoc)
                return Q(false);
            return Q(true);
        }];
    },
    getRoleByUser: function(user) {
        return dbm.load('roles', user.role, 'name');
    }
};

var sm = factory.get('sessionModule');

AuthModule.prototype.validQRCodeByUserId = function(qrid, userid) {
    return dbm.parallel(
            dbm.load('qrcodes', qrid, 'qrid'),
            dbm.load('users', userid, 'userid')
            ).spread(function(qrcode, user){
                if(qrcode.compid !== user.compid)
                    throw new Error('punchFailed')
                return user;
            });
}

AuthModule.prototype.authentication = function(sessionid) {
    var getUser = sm.getUserBySessionId(sessionid);
    

};

AuthModule.prototype.login = function(userid, password) {
    return dbm.use(this._private.checkUser(userid),
            this._private.checkPwd(password));
};

AuthModule.prototype.getAuthKey = function(code) {
    var valid = utils.crypto.verify(config.get('clientAuthSig'), code);
    if(!valid)
        throw new Error('invalid_client_signiture');
    return dbm.use(this._private.newAuthKey()).then(function(authDoc){
        return Q(authDoc.key);
    });
};

AuthModule.prototype.existsAuthKey = function(key) {
    return dbm.use(this._private.existsAuthKey(key));
}

AuthModule.prototype.removeAuthKey = function(key) {
    var self = this;
    return dbm.use(self._private.existsAuthKey(key), function(exists){
        if(!exists) {
            throw new Error('nonexists_key');
        }
        return self._private.removeAuthKey(key).call(this);
    });
};

//var auth = new AuthModule();
//auth.getAuthKey("w6wrw6bCucKQJlzDhsONw7tUw7knBcKJCw9KbCg=").then(function(key){
//    return auth.removeAuthKey(key);
//}).then(function(value){
//    console.log(value);
//});
