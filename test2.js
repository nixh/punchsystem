var Q = require('q');
var um = require('./usermodule');
var user = new um();
var db = require('./lib/common/db');

user.addUser({'userid': "haloroman", "name": "Roman Wang"});
