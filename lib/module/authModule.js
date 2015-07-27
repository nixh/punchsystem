var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config');

module.exports = Module;

dbm.on('before:load', function(col, id, idName){
    console.log(util.format("[%s].%s=%s", col.name, idName, id));
});


function getUser(session) {
    return dbm.load('users', session.userid, 'userid').call(this);
}

function getSession(sessionid) {
    return dbm.load('session', sessionid, 'sessionid').call(this);
}

function Module() {
    var colName = 'session';
    var wrap = function(value) {
        return function() { return value };
    };
    return {
        getUserBySessionId: function(sessionid) {
            return dbm.use(wrap(sessionid), getSession, getUser);
        }
    };
}
