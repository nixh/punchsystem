var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config')();
var logger = require('../../logger');
var Q = require('q');
var fs = require('fs');
var factory = require('./moduleFactory')();

module.exports = UserModule;

function UserModule() {
}

var userColName = 'users';
var extraColName = 'user_extra';

UserModule.prototype._private = {
    loadUser : function(userid, withExtra) {
        if(withExtra) {
            return [dbm.load(userColName, userid, 'userid'),
                    dbm.load(extraColName, userid, 'userid')]
        }
        return dbm.load(userColName, userid, 'userid');
    },
    newUser: function(user, extra) {
        if(extra) {
            if(!extra.userid) {
                extra.userid = user.userid
            }
            return [dbm.insert(userColName, user), 
                    dbm.insert(extraColName, extra)]
        }
        return dbm.insert(userColName, users);
    },

    verifyOldPwd : function(oldPwd) {
        return function(user){
            var isOldPwdSame = utils.crypto.sha(oldPwd) === user.password;
            if(isOldPwdSame) {
                return user;
            }
            throw new Error('old password is invalid!');
        };
    },

    changePwd : function(oldPwd, newPwd) {
        return function(user) {
            if(oldPwd === newPwd) {
                throw new Error('new password cant be the same as old password.')
            }
            var newUserPwd = utils.crypto.sha(newPwd);
            return dbm.updateOne('users', 
                    {_id: user._id}, 
                    {$set: { password: newUserPwd } }
                   ).call(this);
        }
    }
};

UserModule.prototype.changePassword = function(userid, oldpass, newpass) {
    return dbm.use(
            this._private.loadUser(userid), 
            this._private.verifyOldPwd(oldpass),
            this._private.changePwd(oldpass, newpass));
}

UserModule.prototype.load = function(userid, extra) {
    return dbm.parallel(this._private.loadUser(userid, extra))
        .spread(function(user, extra){
            var userObj = {};
            _.extend(userObj, user);
            _.extend(userObj, extra || {});
            return userObj;
        });
}

UserModule.prototype.insert = function(user, extra) {
    return dbm.parallel(this._private.newUser(user, extra));
}

var um = factory.get('userModule');
um.changePassword('ln33', '012', '0123').then(function(user){
    console.log(user);
}).fail(function(err){
    console.log(err);
}).done();

