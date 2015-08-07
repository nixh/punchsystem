var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config')();
var logger = require('../../logger');
var Q = require('q');
var fs = require('fs');
var factory = require('./moduleFactory')();
var qrcode = require('qrcode');
var uuid = require('node-uuid');

var signer = utils.crypto.signer();

module.exports = SettingModule;

var userModule = factory.get('userModule');

function SettingModule() {
}

SettingModule.prototype._private = {
    updateCompSettings: function(settings) {
        return function(compid) {
            return dbm.updateOne('comp_settings', 
                    { compid: compid }, 
                    { $set: settings }
                   ).call(this);
        };
    },

    updateUserSettings: function(userid, settings) {
        return dbm.updateOne('user_settings',
                { userid: userid },
                { $set: settings },
                { new: true, upsert: true });
    },

    newQRCode : function(userid) {}
};

function show(ret) { console.log(ret); }

SettingModule.prototype.settingEmail = function(userid, settings) {
    return dbm.use(this._private.updateUserSettings(userid, settings));
};

SettingModule.prototype.getUserEmailSettings = function(userid) {
    return dbm.use(dbm.load('user_settings', userid, 'userid'))
        .then(function(userSettings){
            if(!userSettings) {
                return {
                    userid: userid,
                    report_send: false
                };
            }
            return userSettings;
        });
};

function prepareQRcodePath(qrid) {
    var sig = signer.sign(qrid);
    var basePath = config.get('paths->punch');
    var path = util.format(basePath, sig);
    return utils.safeBase64(path);
}

SettingModule.prototype.getQRcode = function(userid) {
};

//var stm = factory.get('settingModule');
//stm.getUserEmailSettings('ln2').then(function(settings){
//    console.log(settings.userid); 
//});

