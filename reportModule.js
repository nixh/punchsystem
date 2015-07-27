/**
 * @file Module with Methods that process the reports related functions
 * @author Qing Wang wangq@usnyfuture.com
 *
 */
var dbm = require('./lib/common/db');
var moment = require('moment');
var _ = require('userscore');
var monk = require('monk');

function wrap(value) {
    return function() { return value; };
}

function findLastRecord(recordCol, query) {
    return dbm.query(recordCol, query, options).call(this);
}
function findTheUser(userCol, query) {
    var
    return dbm.load(userCol, );
}

function punch(query, callback) {
    var records = this.db.get('records');
    var users = this.db.get('users');

}

function newRecordFromUserDoc(userDoc, users) {
    return {
        compid: userDoc.compid,
        userid: userDoc.userid,
        hourlyRate: getCurrentRate(userDoc, users),
        remark: 'default remark'
    };
}

var db_module = require('./db_module');
function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}

Module.prototype = {

};

module.exports = Module;
