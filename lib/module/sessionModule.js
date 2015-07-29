var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');
dbm.setUrl('localhost/punchsystem');
module.exports = Module;

var wrap = utils.wrap;

// dbm.on('before:load', function(col, id, idName){
//     console.log(util.format("[%s].%s=%s", col.name, idName, id));
// });

module.exports = Module;

function getUser(session) {
    return dbm.load('users', session.userid, 'userid').call(this);
}

function getSession(sessionid) {
    return dbm.load('session', sessionid, 'sessionid').call(this);
}

function getUserBySessionId(sessionid) {
	return [wrap(sessionid), getSession, getUser];
}

function Module() {
}

Module.prototype = {
	// getUser: getUser,
	// getSession: getSession
	getUserBySessionId:getUserBySessionId

}

// var m = new Module();
// dbm.use(m.getUserBySessionId("6e666d60-297f-11e5-a244-c9cc18e42de3"))
// 	.then(function(user){
//  		console.log(user);
// 	});

//var m = Module();
//m.getUserBySessionId("4b023a30-2fc8-11e5-974c-179d9518471d").done(function(user){
//    console.log(user);
//});

