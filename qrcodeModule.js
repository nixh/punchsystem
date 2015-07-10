var utils     = require('./utils');
var _         = require('underscore');
var monk      = require('monk');
var qrcode    = require('qrcode');
var punchPath = utils.get('paths->dynapunch');
var uuid      = require('node-uuid');
var util      = require('util');

function createDynaQrcode(compid, expirePeriod, cb) {
    var qrCol = this.db.get('qrcodes');
    var currentTime = new Date().getTime();
    var expireTime = currentTime + expirePeriod;
    var id = uuid.v1();
    var signer = utils.getSigner();
    var signedID = signer.sign(id);
    var urlKey = utils.base64URLSafeEncode(signedID);
    var path = util.format(punchPath, urlKey);
    qrcode.toDataURL(path, '', function(err, data){
        var qrObj = {
            qrid: id,
            compid: compid,
            type: 'dynamic',
            qrdata: data,
            expire: expireTime
        };
        qrCol.findAndModify({compid: compid, type:'dynamic'}, {$set: qrObj}, {new: true, upsert: true});

    });


}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}

Module.prototype = {
}

module.exports = Module;
