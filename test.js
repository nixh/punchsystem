var monk = require('monk');
var utils = require('./utils');
var util = require('util');
var db = monk(utils.getConfig('mongodbPath'));
var compid = parseInt(process.argv[2]);

var htmlTpl = '<html><img src="%s"></html>';

db.get('qrcodes').findOne({compid:compid, type:'static'}, {}, function(err, doc){
    console.log(util.format(htmlTpl, doc.qrdata));
    db.close();
});
