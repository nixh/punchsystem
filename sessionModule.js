var utils = require('./utils');
var db = require('./db/db');
var _ = require('underscore');
var monk = require('monk');

/**
 * 
 *
 */
function findSessionInfo(sessionid, cb) {
    var sessionCol = this.db.get('session');
    sessionCol.findOne({sessionid: sessionid}, {}, cb);
}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}

Module.prototype = {
    getSessionInfo : findSessionInfo
}

module.exports = Module;
