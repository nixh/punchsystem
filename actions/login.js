var utils = require('../lib/common/utils');
var actionUtils = utils.actions;

var auth = require('../lib/module/authModule');

var AuthModule = require('../lib/module/authModule');
var Q = require('q');
var auth = new AuthModule();


login = {};

login.view = actionUtils.jadeAction('login');

login.auth = {
    type: 'redirect',
    execute: function(req, res, next) {
        return auth.login('user1', '123123').then(function(valid){
            return "/login";
        });
    }
};

module.exports = login;

