var dbm = require('./lib/common/db');
var util = require('util');
var monk = require('monk');
// console.log(util.inspect(dbm.query, true));


var db = monk('127.0.0.1:3000/test');

db.test.drop('users', function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log(data);
    }
});
