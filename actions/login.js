var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var auth = require('../lib/module/authModule');
var Q = require('q');

login = {};

login.view = actionUtils.jadeAction('login');

login.auth = {
    type: 'redirect',
    execute: function(req, res, next) {
<<<<<<< HEAD

        return "";
=======
        return Q("/staff_main");
>>>>>>> 0e9f3a273dd709655e58db7271011597efe4e585
    }
};

module.exports = login;
