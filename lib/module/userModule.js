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

UserModule.prototype._private = {
    loadUser : function(userid) {
        return dbm.load(userColName, userid, 'userid');
    },
    newUser: function(user) {
        return dbm.insert(userColName, user);
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

UserModule.prototype.load = function(userid) {
    return dbm.parallel(this._private.loadUser(userid))
        .spread(function(user){
            var userObj = {};
            _.extend(userObj, user);
            return userObj;
        });
}

UserModule.prototype.insert = function(user) {
    return dbm.parallel(this._private.newUser(user));
}

//var um = factory.get('userModule');
//um.changePassword('ln33', '0123', '0000').then(function(user){
//    console.log(user);
//}).fail(function(err){
//    console.log(err);
//}).done();

