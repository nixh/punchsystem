var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');

module.exports = SessionModule;

var wrap = utils.wrap;
//dbm.setUrl('localhost/aps');

dbm.on('before:load', function(col, id, idName){
    console.log(util.format("[%s].%s=%s", col.name, idName, id));
});


function getUser(session) {
    return dbm.load('users', session.userid, 'userid').call(this);
}

function getSession(sessionid) {
    return dbm.load('session', sessionid, 'sessionid').call(this);
}

function getUserBySessionId(sessionid) {
    return [wrap(sessionid), getSession, getUser];
}

function SessionModule() {
}

SessionModule.prototype._private = {
    getUser: getUser,
    getSession: getSession
}

SessionModule.prototype.getUserBySessionId = getUserBySessionId;

var m = new SessionModule();
dbm.use(m.getUserBySessionId("8c884240-3628-11e5-8d6e-f523e0443b1e")).done(function(user){
    console.log(user);
});
