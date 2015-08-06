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
    newQRCode : function(userid) {}
};

function show(ret) { console.log(ret); }

SettingModule.prototype.settingEmail = function(userid, settings) {
    return dbm.use(
                userModule._private.loadUser(userid), 
                utils.extract('compid'),
                this._private.updateCompSettings(settings)
           );

}

function prepareQRcodePath(qrid) {
    var sig = signer.sign(qrid);
    var basePath = config.get('paths->punch');
    var path = util.format(basePath, sig);
    return utils.safeBase64(path);
}

SettingModule.prototype.getQRcode = function(userid) {

}

