var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');
var uuid = require('node-uuid');

module.exports = SessionModule;

var wrap = utils.wrap;
dbm.setUrl('localhost/aps');

// dbm.on('before:load', function(col, id, idName){
//     console.log(util.format("[%s].%s=%s", col.name, idName, id));
// });


function getUser(session) {
    return dbm.load('users', session.userid, 'userid').call(this);
}

function getSession(sessionid) {
    return dbm.load('session', sessionid, 'sessionid').call(this);
}

function getUserBySessionId(sessionid) {
    return [wrap(sessionid), getSession, getUser];
}

function newSessionFromUser(user) {
    var sessionObj = {};
    sessionObj.sessionid = uuid.v1();
    sessionObj.userid = user.userid;
    sessionObj.role = user.role;
    sessionObj.compid = user.compid;
    sessionObj.name = user.name;
    return dbm.insert('session', sessionObj).call(this);
}

function removeSessionById(sessionid) {
    return dbm.deleteOne('session', {sessionid: sessionid}).call(this);
}

function SessionModule() {
}

SessionModule.prototype._private = {
    getUser: getUser,
    getSession: getSession
};

SessionModule.prototype.getUserBySessionId = getUserBySessionId;
SessionModule.prototype.newSessionFromUser = newSessionFromUser;
SessionModule.prototype.removeSessionById = removeSessionById;


// var m = new SessionModule();
//
// dbm.use(dbm.dropIfExists('session'),
//         dbm.load('users','user1', 'userid'),
//         m.newSessionFromUser,
//         utils.extract('sessionid'),
//         removeSessionById).done(function(value){
//     console.log(value);
// });
