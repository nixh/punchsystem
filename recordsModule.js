var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');

var db;

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
    var db = this.db;
    var recordsCol = db.get('records');
    recordsCol.findOne({userid: userid}, {sort: {inDate:-1}, limit:1}, function(err, userLastRecord){
        if(err)
            return cb(undefined);
        var userCol = db.get('users');
        userCol.findOne({userid: userid},{}, function(err, userDoc){


            var currentTime = new Date().getTime();
            if(!userLastRecord || userLastRecord.outDate) {
                var recordDoc = newRecordFromUserDoc(userDoc);
                recordDoc.inDate = currentTime;
                recordDoc.outDate = null;
                cb(insertRecord(recordDoc, recordsCol));
            } else {
                userLastRecord.outDate = currentTime;
                cb(updateRecord({_id: userLastRecord._id}, {outDate: currentTime}, recordsCol));
            }

        });

    });
}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
    db = this.db;
}


Module.prototype = {
    punch : punch
}

module.exports = Module 

