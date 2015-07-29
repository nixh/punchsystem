var utils = require('./utils');
var _ = require('underscore');
var monk = require('monk');
var sessionModule = require('./sessionModule');

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
    };
}

function validate(record) {

}

function findUserLastRecord(userid, cb) {
    var recordsCol = this.db.get('records');
    recordsCol.findOne({userid: userid}, {sort: {inDate:-1}, limit:1}, cb);
}

function findLastRecordsByCompid(compid, cb) {
    var recordsCol = this.db.get('records');
    var usersCol = this.db.get('users');
    usersCol.find({compid: compid}, {}, function(err, users) {
        var usersId = users.map(function(u){ return u.userid; });
        recordsCol.col.aggregate([
            { $match: { userid: { $in : usersId } } },
            { $sort: {inDate : -1} },
            { $group: {
                _id: '$userid',
                lastIn: { $first : '$inDate' },
                lastOut:{ $first : '$outDate' }
              }
            },
            { $project: {
                userid:"$_id",
                inDate: "$lastIn",
                outDate: "$lastOut"
              }
            }], function(err, lastRecords){
                if(err)
                    return cb(err);
                var mixinData = {
                    users: users,
                    lastRecords : lastRecords
                };
                return cb(null, mixinData);
            });
    });
}

function punchMany(userIdList, cb) {

    var length = userIdList.length;
    var counter = 0;
    var success = 0;
    var records = [];
    var module = this;
    _.each(userIdList, function(userid){
        module.punch(userid, function(err, record){
            counter++;
            if(!err) {
                success++;
                records.push(record);
            }
            if(counter === length) {
                var err = success === counter ?
                          null : new Error('punch error!');
                return cb(err, records);
            }
        });
    });

}

function punch(userid, cb) {
    var recordsCol = this.db.get('records');
    var userCol = this.db.get('users');
    this.findUserLastRecord(userid, function(err, userLastRecord){
        if(err)
            return cb(undefined);
        userCol.findOne({userid: userid},{}, function(err, userDoc){
            var currentTime = new Date().getTime();
            if(!userLastRecord || userLastRecord.outDate) {
                var recordDoc = newRecordFromUserDoc(userDoc);
                recordDoc.inDate = currentTime;
                recordDoc.outDate = null;
                insertRecord(recordDoc, recordsCol).on('complete',cb);
            } else {
                userLastRecord.outDate = currentTime;
                var promise = updateRecord({_id: userLastRecord._id}, {outDate: currentTime}, recordsCol);
                promise.on('complete', cb);
            }
        });

    });
}

function checkQrcode(qrid, sessionid, cb) {
    var qrcodeCol = this.db.get('qrcodes');
    var userCol = this.db.get('users');
    this.sm.getSessionInfo(sessionid, function(err, doc){
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

function rencentRecords(idObj, cb) {
    var sessionid = null;
    var userid = null;

    if(typeof idObj === 'string')
        userid = idObj;
    else if(typeof idObj === 'object') {
        if(idObj.sessionid)
            sessionid = idObj.sessionid;
        else if(idObj.userid)
            userid = idObj.userid;
    }

    var recordsCol = this.db.get('records');
    var recentNumber = utils.getConfig('app.config->recentRecords.limit');
    if(sessionid) {
        this.sm.getSessionInfo(sessionid, function(err, sessionDoc){
            recordsCol.find({userid: sessionDoc.userid}, {
                             sort: {inDate: -1},
                             limit: recentNumber},
                            cb);
        });
    } else if(userid)
        recordsCol.find({userid: userid}, {sort: {inDate: -1}, limit: recentNumber}, cb);
    else
        cb(new Error('userid or sessionid is required!'));
}

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
    this.sm = new sessionModule({db:this.db});

}


Module.prototype = {
    punch : punch,
    checkQrcode: checkQrcode,
    rencentRecords: rencentRecords,
    findUserLastRecord: findUserLastRecord,
    findLastRecordsByCompid: findLastRecordsByCompid,
    punchMany: punchMany

};

module.exports = Module;

//var rm = new Module();
//rm.findLastRecordsByCompid(3, function(err, doc){
//    console.log(doc);
//    console.log(doc.users.length);
//    console.log(doc.lastRecords.length);
//    rm.db.close();
//
//});

//var rm = new Module();
//var num = process.argv[2];
//rm.punch("LoginName_"+num, function(err, doc){
//    console.log(doc);
//    rm.db.close();
//});





//var module = new Module;

//module.punch('LoginName_1', function(punchPromise){
//});
