var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
<<<<<<< HEAD
var auth = require('../lib/module/authModule');
=======
var AuthModule = require('../lib/module/authModule');
var Q = require('q');
var auth = new AuthModule();
>>>>>>> 36367c8e1ba3fb25a98873d41b08fb02491bc24a

login = {};

login.view = actionUtils.jadeAction('login');

login.auth = {
    type: 'redirect',
    execute: function(req, res, next) {
<<<<<<< HEAD

        return "/login";
=======
        auth.login('user1', '123123').then(function(valid){
            console.log(valid);
        })
        
>>>>>>> 36367c8e1ba3fb25a98873d41b08fb02491bc24a
    }
};

module.exports = login;

