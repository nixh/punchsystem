var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
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

login.api = {
    type: 'api',
    execute: function(req, res, next) {
        var username = req.body.userName;
        var password = req.body.password;
        return auth.login(username, password).then(function(user){
            var ret = {};
            if(user) { 
                ret.status = "success";
                ret.msg = "";
                ret.data = {
                    headPortraitUrl: user.avatar,
                    name: user.name,
                    userid: user.userid,
                    gender: user.sex,
                    address: user.address,
                    tel: user.tel,
                    email: user.email
                };
            } else {
                ret.status = "fail";
                ret.msg = "";
            }
            return Q(ret);
        });
    }
}

module.exports = login;

