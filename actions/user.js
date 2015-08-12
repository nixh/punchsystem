var Q = require('q');
var utils = require('../lib/common/utils');
var AuthModule = require('../lib/module/authModule');
var factory = require('../lib/module/moduleFactory')();
var am = new AuthModule();
var config = require('../lib/common/config')();
var moment = require('moment');

var user = {}

user.newUser = utils.actions.jadeAction('userform', {err: 'test err' });
module.exports = user;
