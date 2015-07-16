var utils = require('./utils');
//var db = require('./db/db');
var sessionModule = require('./sessionModule');
var _ = require('underscore');
var monk = require('monk');

function validate(record) {

}

function insertRecord(record, records) {
    return records.insert(record);
}

function updateRecord(query, record, records) {
    return records.findAndModify(query, { $set: record }, { new: true });
}

function newRecordFromUserDoc(userDoc) {
    return {
        compid: userDoc.compid,
        userid: userDoc.userid,
        //hourlyrate: userDoc.curRate,
        remark: 'defaut remark'
    }
}

function findLastUserRecord(query, callback) {
    var records = this.db.get('records');
    records.findOne(query, {sort: {inDate: -1}, limit: 1}, callback);
}

function findLastRecordsByCompid(compid, callback) {
    var records = this.db.get('records');
    var users = this.db.get('users');
    users.find({compid: compid}, {}, function(err, users) {
        var userid = users.map(function(u) { return u.userid });
        records.col.aggregate([
            { $match : { userid : { $in : userId } } },
            { $sort : { inDate : -1 } },
            { $group :
                {
                    _id : '$userid',
                    lastIn : { $first : '$inDate' },
                    lastOut : {$first : '$outDate' }
                }
            },
            { $project :
                {
                    userid : '$_id',
                    inDate : '$lastIn',
                    outDate : 'lastOut'
                }
            }
        ], function(err, lastRecords) {
            if (err) {
                return callback(err);
            }
            var mixinData = {
                users : users,
                lastRecords : lastRecords
            };
            return callback(null, mixinData);
        });
    });
}

function checkQrcode(qrid, sessionid, callback) {
    var qrcodes = this.db.get('qrcodes');
    var users = this.db.get('users');
    this.sm.getSessionInfo(sessonid, function(err, doc) {
        qrcodes.findOne({ qrid : qrid }, {}, function(err, qrDoc) {
            if (qrDoc.compid == doc.compid) {
                users.findOne({ userid : doc.userid }, {}, function(err, uDoc) {
                    callback(true, uDoc);
                });
            } else {
                callback(false);
            }
        });
    });
}

function rencentRecords(idObj, callback) {
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

    var records = this.db.get('records');
    var recentNumber = utils.getConfig('app.config->recentRecords.limit');
    if(sessionid) {
        this.sm.getSessionInfo(sessionid, function(err, sessionDoc){
            records.find({userid: sessionDoc.userid}, {
                             sort: {inDate: -1},
                             limit: recentNumber},
                            callback);
        });
    } else if(userid)
        records.find({userid: userid}, {sort: {inDate: -1}, limit: recentNumber}, cb);
    else
        callback(new Error('userid or sessionid is required!'));
}

function getCurrentRate(userid, users) {
    users.findOne({userid: userid}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            var hourlyRate = user.houlyRate;
            hourlyRate.sort().reverse();
            return hourlyRate[0].rate;
        }
    });
}
//********** Functions for punch **************//
function punch(query, callback) {
    var records = this.db.get('records');
    var users = this.db.get('users');
    this.findLastUserRecord(query, function(err, lastRecord) {
        if (err) {
            callback(err);
        }
        users.findOne(query, {}, function(err, user) {
            var timeNow = new Date().getTime();
            if (!lastRecord || lastRecord.outDate) {
                var newRecord = newRecordFromUserDoc(user);
                newRecord.hourlyrate = getCurrentRate(userid, users);
                newRecord.inDate = timeNow;
                newRecord.outDate = null;
                insertRecord(newRecord, records).on('complete', callback);
            } else {
                lastRecord.outDate = timeNow;
                var promise = updateRecord({_id: lastRecord._id}, {outDate: timeNow}, records);
                promise.on('complete', callback);
            }
        });
    });
}

function punchMany(userIdList, callback) {
    var length = userIdList.length;
    var counter = 0;
    var success = 0;
    var records = [];
    var module = this;
    _.each(userIdList, function(userid) {
        module.punch(userid, function(err, record) {
            counter++;
            if (!err) {
                success++;
                records.push(record);
            }
            if (counter === length) {
                var err = success === counter ? null : new Error('punch error!');
                return callback(err, records);
            }
        });
    });
}
//*********************************************//
function getOneRecord(query, callback) {
    var db = this.db;
    var records = db.get('records');
    records.findOne(query, {}, callback);
}
//********** Functions for delete **************//
function deleteRecords(rid, callback) {
    var db = this.db;
    var records = db.get('records');
    var query = {_id: rid};
    records.remove(query, function(err, docs) {
        var msg = true;
        if (err) {
            msg = false;
        }
        callback(msg);
    });
}
//*********************************************//
//********** Functions for search&show **************//
function searchRecords(query, su, callback) {
    var db = this.db;
    var records = db.get('records');
    records.find(query, function(err, recs) {
        if (err) {
            res.send('Can not get records, try again!');
        } else {
            jsonData = {};
            jsonData.su = su;
            jsonData.records=[];
            recs.forEach(function(rec, index) {
                var record = {};
                record.userid = query.userid;
                record.reportid = rec.reportid;
                record.inDate = rec.inDate;
                record.outDate = rec.outDate;
                record.hourlyrate = rec.hourlyRate;
                jsonData.records.push(record);
            });
            var userid = query.userid;
            db.get("users").findOne({userid: userid}, function(err, docs) {
                if(err || !docs) {

                } else {
                    jsonData.username = docs.name;
                    jsonData.userid = userid;
                }
                callback(jsonData);
            });
        }
    });
}
//*********************************************//
//********** Functions for modify **************//
function updateRecords(query, newrec, callback) {
    var db = this.db;
    var records = db.get('records');
    records.update(query, {"$set": newrec}, function(err, docs) {
        var msg = true;
        if (err) {
            msg = false;
        }
        callback(msg);
    });
}
//*********************************************//
//********* Functions for getting wages *********//
function getTotalHoursByRate(records, query, callback) {
    var userid = query.userid;
    var startDate = query.startDate;
    var endDate = query.endDate;
    records.col.aggregate([
        {
            $sort: {
                inDate: 1
            }
        },
        {
            $match: {
                userid: 'LoginName_1', inDate: {$gte: 1433822400000}, outDate: {$lte: 1437451200000}
            }
        },
        {
            $group: {
            _id: '$userid',
            salaryByRate: { $sum : { $multiply: { $subtract: ['$outDate', '$inDate']}}},
            hoursOfUsers: { $sum : { $subtract: ['$outDate', '$inDate']}}
            }
        }
    ], function(err, recs) {
        if (err) {
            console.log(err);
        }
        callback(err, recs);
    });
}

function getWagesByWeek(query, callback) {
    //console.log(query);
    var db = this.db;
    var records = db.get('records');
    var users = db.get('users');
    var userid = query.userid;
    getTotalHoursByRate(records, query, function(err, recs) {
        if (err) {
            console.log(err);
        } else {
            var totalwages = 0;
            var totalHours = 0;
            var sumRate = 0;
            recs.forEach(function(rec, index) {
                sumRate += rec._id;
                totalHours += (rec.totalOut - rec.totalIn) / (1000 * 3600);
                totalwages += totalHours * rec._id;
            });
            console.log(totalwages);
            var avgRate = sumRate / recs.length;
            var overTime = 0;
            if (totalHours > 40) {
                overTime = totalHours - 40;
            }
            totalwages += overTime * avgRate * 0.5;
            jsonData = {};
            jsonData.totalHours = totalHours;
            jsonData.overTime = overTime;
            jsonData.totalwages = totalwages;
            users.find({userid : userid}, function(err, user) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    jsonData.user = user;
                    callback(jsonData);
                }
            });
        }
    });
}

function getWageReport(query, callback) {
    var db = this.db;
    var records = db.get('records');
    var users = db.get('users');

}
//*********************************************//
var db_module = require('./db_module');
function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
    this.sm = new sessionModule({db:this.db});
}

Module.prototype = {
    getWagesByWeek : getWagesByWeek,
    updateRecords : updateRecords,
    getOneRecord : getOneRecord,
    findLastRecordsByCompid : findLastRecordsByCompid,
    punch : punch,
    punchMany : punchMany,
    findLastUserRecord: findLastUserRecord,
    deleteRecords : deleteRecords,
    searchRecords : searchRecords,
    modify : updateRecords
}

module.exports = Module
