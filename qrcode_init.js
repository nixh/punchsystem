var monk = require('monk');
var utils = require('./utils');
var db = monk(utils.getConfig('mongodbPath'));
var _ = require('underscore');
var punchPath = utils.getConfig("paths->punch");
var util = require('util');
var nobi = require('nobi');
var signer = nobi(utils.getConfig('appKey'));
var uuid = require('node-uuid');


var qrcode = require('qrcode');
var compCol = db.get('companies');
var qrcodeCol = db.get('qrcodes');

qrcodeCol.drop();

compCol.find({}, {}, function(err, comps){

    var counter = 0;
    var length = comps.length;
    _.each(comps, function(comp){
        var idSigned = signer.sign(uuid.v1());
        var parts = idSigned.split('.');
        var id = parts[0];
        var key = parts[1];
        key = utils.base64URLSafeEncode(key);
        var punchURL = util.format(punchPath, id+"."+key);
        qrcode.toDataURI(punchURL, '', function(err, data){
            var qrRecords = {
                qrid : id,
                qrdata: data,
                compid: comp.compid,
                type: 'static'
            }
            qrcodeCol.insert(qrRecords, function(err, doc){
                counter++;
                if(counter === length) {
                    db.close();
                    console.log('finished insert qrcodes data');
                }
            });
        });
    });
});
