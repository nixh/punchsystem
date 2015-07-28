var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var auth = require('../lib/module/authModule');

login = {};

login.view = actionUtils.jadeAction('login');

login.auth = {
    type: 'redirect',
    execute: function(req, res, next) {

        return "/login";
    }
};

module.exports = login;
