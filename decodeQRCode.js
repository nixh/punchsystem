var qrnode = require('qrnode');
var fs = require('fs');
var regex = /^data:.+\/(.+);base64,(.+)/;
var dbm = require('./lib/common/db');
var userid = process.argv[2];
var utils = require('./lib/common/utils');

function queryQRCodeByUserid(userid) {
    return [dbm.load('users', userid, 'userid'), 
            utils.extract('compid'), 
            function(compid){
                return dbm.load('qrcodes', compid, 'compid').call(this);
            }];
}

dbm.use(queryQRCodeByUserid(userid)).then(function(qrcode){
    var data = qrcode.qrdata;
    var matches = data.match(regex);
    var ext = matches[1];
    var qrdata = matches[2];
    var buf = new Buffer(qrdata, 'base64');
    var tempName = "./temp." + ext;
    fs.writeFile(tempName, buf, function(err){
        qrnode.detect(__dirname+"/"+tempName, function(res){
            console.log(res);
            fs.unlinkSync(__dirname+"/"+tempName);
        }); 
    });
});

