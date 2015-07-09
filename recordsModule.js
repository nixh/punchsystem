var utils = require('./utils');
var db = require('./db/db');
var _ = require('underscore');
var monk = require('monk');
var sessionModule = require('./sessionModule');

function insertRecord(record, recordsCol) {
    return recordsCol.insert(record);
}

function updateRecord(query, record, recordsCol) {
    return recordsCol.findAndModify(query, { $set: record }, { new: true });
}

function newRecordFromUserDoc(userDoc) {
    return {
        compid: userDoc.compid,
        userid: userDoc.userid,
        hourlyRate: userDoc.curRate,
        remark: 'default remark'        
    }
}

function validate(record) {

}
function punch(userid, cb) {
    var recordsCol = this.db.get('records');
    var userCol = this.db.get('users');
    recordsCol.findOne({userid: userid}, {sort: {inDate:-1}, limit:1}, function(err, userLastRecord){
        if(err)
            return cb(undefined);
        userCol.findOne({userid: userid},{}, function(err, userDoc){

            var currentTime = new Date().getTime();
            if(!userLastRecord || userLastRecord.outDate) {
                var recordDoc = newRecordFromUserDoc(userDoc);
                recordDoc.inDate = currentTime;
                recordDoc.outDate = null;
                insertRecord(recordDoc, recordsCol).complete(cb);
            } else {
                userLastRecord.outDate = currentTime;
                var promise = updateRecord({_id: userLastRecord._id}, {outDate: currentTime}, recordsCol);
                promise.complete(cb);
            }
        });

    });
}

function checkQrcode(qrid, sessionid, cb) {
    var sm = new sessionModule(this.db);
    var qrcodeCol = this.db.get('qrcodes');
    var userCol = this.db.get('users');
    sm.getSessionInfo(sessionid, function(err, doc){
        qrcodeCol.findOne({qrid: qrid}, {}, function(err, qrDoc){
            if(qrDoc.compid == doc.compid) {
                userCol.findOne({userid: doc.userid}, {}, function(err, userDoc){
                    cb(true, userDoc);
                });
            } else {
                cb(false);
            }
        });
    });


}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
}


Module.prototype = {
    punch : punch,
    checkQrcode: checkQrcode
}

module.exports = Module 

var module = new Module;

module.punch('LoginName_1', function(punchPromise){
});







