var utils = require('./utils');
var sessionModule = require('./sessionModule');
var moment  = require('moment');
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

function newRecordFromUserDoc(userDoc, users) {
    return {
        compid: userDoc.compid,
        userid: userDoc.userid,
        hourlyrate: getCurrentRate(userDoc.userid, users),
        remark: 'defaut remark'
    };
}

function findLastUserRecord(query, callback) {
    var records = this.db.get('records');
    records.findOne(query, {sort: {inDate: -1}, limit: 1}, callback);
}

function findLastRecordsByCompid(compid, callback) {
    var records = this.db.get('records');
    var users = this.db.get('users');
    users.find({compid: compid}, {}, function(err, users) {
        var userid = users.map(function(u) { return u.userid; });
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
        //console.log(user);
        if(err) {
            console.log(err);
        } else {
            var hourlyRate = user.houlyRate;
            hourlyRate.sort().reverse();
            return hourlyRate[0].rate;
        }
    });
}

//********** Functions for delegate **************//
function showUsersForDelegate(sessionid, callback) {
    var users = this.db.get('users');
    var delegation = this.db.get('delegation');
    this.sm.getSessionInfo(sessionid, function(err, sessionDoc) {
        console.log(sessionDoc.compid);
        users.find({compid : sessionDoc.compid, owner : false}, function(err, userInfos) {
            var ret = {msg: null, ok: true};
            if (!userInfos) {
                ret.ok = false;
                ret.msg = "No data found!";
                callback(err, ret);
            } else {
                delegation.find({compid : sessionDoc.compid}, function(err, dels) {
                    userInfos.forEach(function(userInfo, index) {
                        userInfo.delegate = false;
                        //console.log(userInfo);
                        dels.forEach(function(del, i) {
                            if (userInfo.userid === del.userid) {
                                userInfo.delegate = true;
                            }
                        });
                    });
                    ret.userInfos = userInfos;
                    callback(err, ret);
                });
            }
        });
    });
}
function delegate(query, callback) {
    var delegation = this.db.get('delegation');
    var users = this.db.get('users');
    var userid = query.userid;
    var flag = query.flag;
    var sessionid = query.sessionid;
    this.sm.getSessionInfo(sessionid, function(err, docs) {
        var compid = docs.compid;
        if (flag === 1) {
            var newRec = { compid : compid, userid : userid };
            delegation.insert(newRec, function(err, msg) {
                callback(err, msg);
            });
        } else {
            var newQuery = { userid: userid};
            delegation.remove(newQuery, function(err, msg) {
                callback(err, msg);
            });
        }
    });
}
function checkDelegate(query, callback) {
    var userid = query.userid;
    var delegationg = this.db.get('delegation');
    delegation.find({userid : userid}, function(err, dels) {
        callback(err, dels);
    });
}
//*********************************************//

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
                var newRecord = newRecordFromUserDoc(user, users);
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
        module.punch(userid, function(error, record) {
            counter++;
            if (!error) {
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
function searchRecords(query, callback) {
    var db = this.db;
    var records = db.get('records');
    records.find(query, function(err, recs) {
        if (err) {
            res.send('Can not get records, try again!');
        } else {
            jsonData = {};
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
    records.findAndModify(query, {"$set": newrec}, {new: true}, function(err, docs) {
        console.log(docs);
        callback(err, docs);
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
                userid: 'LoginName_1', inDate: {$gte: startDate}, outDate: {$lte: endDate}
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

function getWageOfUser(query, callback) {
    //console.log(query);
    var db = this.db;
    var records = db.get('records');
    var users = db.get('users');
    var userid = query.userid;
    getTotalHoursByRate(records, query, function(err, recs) {
        if (err) {
            console.log(err);
        } else {
            var totalWage = 0;
            var totalHours = 0;
            var sumRate = 0;
            recs.forEach(function(rec, index) {
                sumRate += rec._id;
                totalHours += (rec.totalOut - rec.totalIn) / (1000 * 3600);
                totalWage += totalHours * rec._id;
            });
            //console.log(totalWage);
            var avgRate = sumRate / recs.length;
            var overTime = 0;
            if (totalHours > 40) {
                overTime = totalHours - 40;
            }
            totalWage += overTime * avgRate * 0.5;
            jsonData = {};
            jsonData.totalHours = totalHours;
            jsonData.overTime = overTime;
            jsonData.totalWage = totalWage;
            users.find({userid : userid}, function(err, user) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    jsonData.user = user;
                    callback(err, jsonData);
                }
            });
        }
    });
}
//Assume that function get a week time as argument
// function decimalByTwo(number, precision) {
//     var dec = number - Math.floor(number);
//     var pre = Math.round(dec * Math.pow(10, precision));
//     return number + "." + pre;
// }
function getWageByWeek(query, callback) {
    var db = this.db;
    var records = db.get('records');
    var users = db.get('users');
    var compid = query.compid;
    var startDate = query.startDate;
    var endDate = query.endDate;
    users.find({ compid : compid,  owner : false}, function(err, userList) {
        if (err) {
            console.log(err);
        } else {
            var userIdList = userList.map(function(u) {return u.userid;});
            records.col.aggregate([
                { $match : {  userid: {$in : userIdList} , inDate: {$gte: startDate}, outDate: {$ne: null, $lte: endDate} } },
                { $sort : { inDate : 1} },
                { $group : {
                        _id : { rate : '$hourlyRate', userid : '$userid' },
                        totalIn : { $sum : '$inDate' },
                        totalOut : { $sum : '$outDate' },
                        from : { $first : '$inDate' },
                        to : {$last : '$outDate'}
                    }
                },
                { $group : {
                        _id : {userid : '$_id.userid' },
                        from : { $first : '$from' },
                        to : { $last : '$to' },
                        totalHours : { $sum : { $subtract : ['$totalOut', '$totalIn'] } },
                        avgRate : { $avg : '$_id.rate' },
                        rates : {
                            $push : {
                                rate : '$_id.rate',
                                workhours : { $subtract : ['$totalOut', '$totalIn'] }
                            }
                        }
                    }
                },
                { $project : {
                        userid : '$_id.userid',
                        from : '$from',
                        to : '$to',
                        totalhours : '$totalHours',
                        rates : '$rates',
                        avgRate : '$avgRate',
                        _id : 0
                    }
                }
            ], function(err, reports) {
                if (err) {
                    console.log(err);
                    return callback(err);
                } else {
                    jsonData = {};
                    jsonData.userReports = [];
                    reports.forEach(function(report, index) {
                        var totalhours = report.totalhours / (1000 * 3600);
                        userReport = {};
                        userReport.userid = report.userid;
                        userReport.from = moment(report.from).format("LLLL");
                        userReport.to = moment(report.to).format("LLLL");
                        userReport.totalhours = totalhours;
                        userReport.avgRate = report.avgRate;
                        var totalWage = 0;
                        var rates = report.rates;
                        rates.forEach(function(userRate, i) {
                            var hours = (userRate.workhours / (3600 * 1000));
                            totalWage += userRate.rate * hours;
                        });
                        var overTime = totalhours - 40;
                        if (overTime > 0) {
                            totalWage += overTime * report.avgRate * 0.5;
                        }
                        userReport.totalWage = totalWage;
                        jsonData.userReports.push(userReport);
                    });
                    jsonData.userList = userList;
                    callback(err, jsonData);
                }
            });
        }
    });
}

function getWageByMonth(query, callback) {
    var startDate = moment(query.startDate);
    jsonDataArray = [];
    if(startDate.day() != 1) {
        startDate.add(1, 'w');
    }
    var counter = 0;
    var calltimes = 4;
    for (var i = 0; i < calltimes; i++) {
        startDate = startDate.startOf('week');
        var start = startDate.valueOf();
        startDate.add(1, 'w');
        var end = startDate.valueOf();
        newQuery = {compid : query.compid, startDate : start, endDate : end};
        this.getWageByWeek(newQuery, function(err, jsonData) {
            jsonDataArray.push(jsonData);
            if(++counter === calltimes) {
                callback(err, jsonDataArray);
            }
        });
    }
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
    checkDelegate : checkDelegate,
    showUsersForDelegate : showUsersForDelegate,
    delegate : delegate,
    getWageByMonth : getWageByMonth,
    getWageByWeek : getWageByWeek,
    getWageOfUser : getWageOfUser,
    updateRecords : updateRecords,
    getOneRecord : getOneRecord,
    findLastRecordsByCompid : findLastRecordsByCompid,
    punch : punch,
    punchMany : punchMany,
    findLastUserRecord: findLastUserRecord,
    deleteRecords : deleteRecords,
    searchRecords : searchRecords,
    modify : updateRecords
};

module.exports = Module;
