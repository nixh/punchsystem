var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var auth = require('../lib/module/authModule');
var Q = require('q');

login = {};

login.view = actionUtils.jadeAction('login');

login.auth = {
    type: 'redirect',
    execute: function(req, res, next) {
        return Q("/staff_main");
    }
}

module.exports = login;
