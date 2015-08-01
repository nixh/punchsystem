var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var usermodule = require('../lib/module/userModule');
var sessionmodule = require('../lib/module/sessionModule');

var Q = require('q');
var um = new usermodule();
var sm = new sessionmodule();

users = {};

users.allUsersView = {
    type: 'jade',
    template: './views/users/userListSearch',
    execute: function(req, res, next) {
		var sessionid = req.cookies.sessionid;
        var compid = sm.getSession(sessionid).compid;
        var query = {compid: compid};
        var users = um.getAllUsers(query);
        return users.then(function(user) {
			var data = user;
			return data;
		});
	}
};

module.exports = users;
