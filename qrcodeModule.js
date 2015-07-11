var utils     = require('./utils');
var _         = require('underscore');
var monk      = require('monk');
var qrcode    = require('qrcode');
var punchPath = utils.getConfig('paths->punch');
var uuid      = require('node-uuid');
var util      = require('util');
var sModule   = require('./sessionModule');


function getDynacode(sessionid, cb) {
    var qrCol = this.db.get('qrcodes');
    var csCol = this.db.get('comp_settings')
    var sm = new sModule({db:this.db});
    var module = this;
    sm.getSessionInfo(sessionid, function(err, sObj){
        csCol.findOne({compid:sObj.compid},{}, function(err, settings){
            module.createDynaQrcode(sObj.compid, 3*3600*1000, function(err, qrdata){
                var mixinData = {};
                _.extend(mixinData, qrdata);
                _.extend(mixinData, settings);
                cb(err, mixinData)
            });
        });
    });

}

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
        qrCol.findAndModify(
            {compid: compid, type:'dynamic'}, 
            {$set: qrObj}, 
            {new: true, upsert: true}, cb);
    });
}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}

Module.prototype = {
    createDynaQrcode : createDynaQrcode,
    getDynacode : getDynacode
}

module.exports = Module;

