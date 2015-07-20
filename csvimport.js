var fs = require('fs');

var monk = require('monk');
var utils = require('./utils');
var db = monk(utils.getConfig('mongodbPath'));
var dbhelper = require('./db/db');
var userModule = require('./usermodule');

//var path = process.argv[2];

var path = "./test.csv";

var fileString = fs.readFileSync(path).toString('utf8');

var lines = fileString.split('\n');

lines.forEach(function(line, index){
    if(index === 0)
        return; //Skip Head
    var columns = line.split(',');
    var compName = columns[0];
    if(!compName)
        return;
    var currentDate = new Date().getTime();
    var loginName = columns[1];
    var name = columns[2];
    var initPass = columns[3];
    var tel = columns[4];
    var email = columns[5];
    var add_street = columns[6].substring(1);
    var add_city = columns[7];
    var add_state = columns[8];
    var add_zip = columns[9].substring(0, columns[7].length-1);
    var sex = columns[10] === '男';
    var expireDate = parseInt(columns[11]) * 24 * 3600 * 1000 + currentDate;
    var compDoc = {
        name: compName,
        registerDate: currentDate,
        expireDate: expireDate 
    };
    var userObj = {
        userid: loginName,
        name: name,
        password: initPass,
        sex: sex,
        email: email,
        address_street: add_street,
        address_city: add_city,
        address_state: add_state,
        address_zip : add_zip,
        tel : tel,
        rates: [{ createTime: currentDate, rate: 9 }]
    };
    dbhelper.newDocWithIncId('companies', 'compid', compDoc, db, function(err, comp){
        db.get('comp_settings').insert({
            compid: comp.compid,
            "wifi_verify" : false,
            "report_send" : true,
            "use_default_email" : true,
            "report_emails" : [],
            "report_send_frequency" : 0,
            "qrcode_update_frequency" : 7000
        }, function(err, defaultSettings){
            var um = new userModule({db: db});
            um.addUser(userObj, function(err, user){
                um.db.close();
                console.log(user);
            });
        });
        
    });

    

    

});

