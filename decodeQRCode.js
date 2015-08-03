var qrnode = require('qrnode');
var fs = require('fs');
var regex = /^data:.+\/(.+);base64,(.+)/;

var dbm = require('./lib/common/db');
dbm.use(dbm.query('qrcodes', {})).then(function(qrcodes){
    var data = qrcodes[0].qrdata;
    var matches = data.match(regex);
    var ext = matches[1];
    var qrdata = matches[2];
    var buf = new Buffer(qrdata, 'base64');
    fs.writeFile('./temp.png', buf, function(err){
        qrnode.detect(__dirname+"/temp.png", function(res){
            console.log(res);
        }); 

    });


});

