/**
 * @file Module with Methods that process the reports related functions
 * @author Qing Wang wangq@usnyfuture.com
 *
 */
var moment = require('moment');
var _ = require('underscore');
var monk = require('monk');
var records = 'records';
var users = 'users';
var delegation = 'delegation';
var Q = require('q');
var utils = require('../common/utils');
var config = require('../common/config')();
var dbm = require('../common/db');

function wrap(value) {
    return function() { return value; };
}

function newRecordFromUserDoc(user) {
    var rate = null;
    if(user.hourlyRate) {
        var rateArray = user.hourlyRate.sort(function(a,b) {
            return b.changetime - a.changetime;
        });
        rate = rateArray[0].rate;
    } else {
        rate = user.curRate;
    }
    rate = parseFloat(rate);

    return {
        compid: user.compid,
        userid: user.userid,
        hourlyRate: rate,
        remark: 'default remark'
    };
}

function loadLastRecords(userid) {
    var options = {sort: {inDate:-1}, limit:1};
    return dbm.load(records, userid, 'userid', options);
}

function loadUserById(userid) {
    return dbm.load(users, userid, 'userid');
}

function getUsersBySession(session) {
    var query = {compid: session.compid, owner: false};
    return dbm.query(users, query);
}

function getDelsBySession(session) {
    var query = {compid: session.compid};
    return dbm.query(delegation, query);
}

function delegateJudge(userInfos, delegates) {
    var ret = {msg: null, ok: true};
    if (!userInfos) {
        ret.ok = false;
        ret.msg = 'No data Found!';
    } else {
        userInfos.forEach(function(userInfo, index) {
            userInfo.delegate = false;
            delegates.forEach(function(delegate, i) {
                if (userInfo.userid === delegate.userid) {
                    userInfo.delegate = true;
                }
            });
        });
        ret.userInfos = userInfos;
    }
    return ret;
}

function punchHelper(user, lastRecord) {
    var currentTime = new Date().getTime();
    if (!lastRecord || lastRecord.outDate) {
        var newRecord = newRecordFromUserDoc(user);
        newRecord.inDate = currentTime;
        newRecord.outDate = null;
        return dbm.use(dbm.insert(records, newRecord));
    } else {
        var query = { _id : lastRecord._id };
        lastRecord.outDate = currentTime;
        return dbm.use(dbm.updateOne(records, query, { $set : lastRecord }));
    }
}


function modifyRecordDate(newTime) {
    return function(rec) {
        if (newTime.inDate) {
            rec.inDate = newTime.inDate;
        }
        if (newTime.outDate) {
            rec.outDate = newTime.outDate;
        }
        return wrap(rec).call(this);
    };
}

function updateOneRecord(query) {
    return function(newRec) {
        dbm.updateOne(records, query, newRec);
    };
}

function findRecordById(_id) {
    return dbm.load(records, _id, '_id');
}

function getRecordsByUserId(recentNumber) {
    return function(session) {
        var userid = session.userid;
        var query = {userid : userid};
        var options = {sort: {inDate: -1}, limit: recentNumber};
        return dbm.query(records, query, options).call(this);
    };
}

function getSessionBySessionid(sessionid) {
    return dbm.load('session', sessionid, 'sessionid');
}

function searchRecordsByTimeRange(searchArgs) {
    var query = searchArgs[0];
    var op = searchArgs[1];
    var options = {sort: {inDate: -1}};
    _.extend(options, op);
    return dbm.query(records, query, options).call(this);
}

function delegateAction(userid, flag) {
    return function(session) {
        if (flag === 1) {
            var newDelegate = {compid: session.compid, userid: userid};
            return dbm.insert(delegation, newDelegate).call(this);
        } else {
            var query = {userid: userid};
            return dbm.deleteOne(delegation, query).call(this);
        }
    };
}

function getUserListBySession(session) {
    var query = {compid: session.compid, owner: false};
    return dbm.query(users, query).call(this);
}

function recordsAggregation(startDate, endDate) {
    return function(userList) {
        var useridList = userList.map(function(user) {
            return user.userid;
        });
        aggregate = [
            { $match: {
                userid: { $in: useridList },
                inDate: { $gte: startDate },
                outDate: { $ne: null, $lte: endDate }
                }
            },
            { $sort: { inDate: 1 } },
            { $group: {
                _id: { rate: '$hourlyRate', userid: '$userid' },
                totalIn: { $sum: '$inDate' },
                totalOut: { $sum: '$outDate' },
                from: { $first: '$inDate' },
                to: { $last: '$outDate' }
                }
            },
            { $group: {
                _id: { userid: '$_id.userid'},
                from: { $first: '$from' },
                to: { $last: '$to' },
                totalHours: { $sum: { $subtract: ['$totalOut', '$totalIn'] } },
                avgRate: { $avg: '$_id.rate'},
                rates: {
                    $push: {
                        rate: '$_id.rate',
                        workhours: { $subtract: ['$totalOut', '$totalIn']}
                        }
                    }
                }
            },
            { $project: {
                userid: '$_id.userid',
                from: '$from',
                to: '$to',
                totalHours: '$totalHours',
                rates: '$rates',
                avgRate: '$avgRate',
                _id: 0
                }
            }
        ];
        return dbm.aggregate(records, aggregate).call(this).then(function(reports) {
            return Q([userList, reports]);
        });
    };
}

function weeklyReport(values) {
    var userList = values[0];
    var reports = values[1];
    var jsonData = {};
    jsonData.userReports = [];
    reports.forEach(function(report, index) {
        var userReport = {};
        var totalHours = report.totalHours / (1000 * 3600);
        userReport.totalHours =totalHours;
        userReport.userid = report.userid;
        userReport.from = moment(report.from).format('LLLL');
        userReport.to = moment(report.to).format('LLLL');
        userReport.avgRate = report.avgRate;
        var totalWage = 0;
        report.rates.forEach(function(userRate, index) {
            var hours = (userRate.workhours / (3600 * 1000));
            totalWage += userRate.rate * hours;
        });
        var overTime = totalHours - 40;
        if (overTime > 0) {
            totalWage += overTime * report.avgRate * 0.5;
        }
        userReport.totalWage = totalWage;
        jsonData.userReports.push(userReport);
    });
    jsonData.userList = userList;
    // console.log(jsonData);
    return jsonData;
}

/******************************************************************************/


function punch(userid) {
    return dbm.parallel(
        loadUserById(userid),
        loadLastRecords(userid)
    ).spread(punchHelper);
}

function punchMany(userIdList) {
    var promises = userIdList.map(function(userid){

    });
}

function deleteRecord(_id) {
    var query = {_id: _id};
    return dbm.use(dbm.deleteOne(records, query));
}

function updateRecord(_id, newTime) {
    var query = {_id: _id};
    return dbm.use(
        findRecordById(_id),
        modifyRecordDate(newTime),
        function(newRec) {
            return dbm.updateOne(records, query, newRec).call(this);
        }
    );
}

/**
 * Function that will get the records of a specific user
 * @function recentRecords(idObj)
 * @param idObj: While using by the supervisor, idObj will be the userid of a
 *              specific user, otherwise will be an object with the sessionid of
 *              specific user.
 */
function recentRecords(idObj) {
    var userid = null;
    var sessionid = null;
    var reccentNumber = parseInt(config.get('recentRecords.limit')) || 5;
    if (typeof idObj === 'string') {
        userid = idObj;
    } else if (typeof idObj === 'object') {
        if (idObj.sessionid) {
            sessionid = idObj.sessionid;
        } else if (idObj.userid) {
            userid = idObj.userid;
        }
    }

    if(!userid && !sessionid) {
        throw new Error('userid or sessionid is required');
    }

    if (userid) {
        return dbm.use(wrap(userid), getRecordsByUserId(reccentNumber));
    } else if (sessionid) {
        return dbm.use(getSessionBySessionid(sessionid), getRecordsByUserId(reccentNumber));
    }
}
/******************************************************************************/

function searchRecords(userid, startDate, endDate, length_limit) {
    var query = {userid: userid, inDate: {$gte: startDate} };
    var or = [{outDate: {$lte: endDate} }, { outDate: null }];
    query['$or'] = or;
    console.log(query);
    options = length_limit ? { limit: length_limit } : {};
    function buildSearchArgs() {
        return function() {
            return Q([query, options]);
        };
    }
    return dbm.use(buildSearchArgs(), searchRecordsByTimeRange);
}

function showUsersForDelegate(sessionid) {
    return dbm.use(
        getSessionBySessionid(sessionid)
    ).then(function(session) {
        return dbm.parallel(
            getUsersBySession(session),
            getDelsBySession(session)
        );
    }).spread(delegateJudge);
}

function delegate(userid, flag, sessionid) {
    return dbm.use(
        getSessionBySessionid(sessionid),
        delegateAction(userid, flag)
    );
}

function getReportsByWeek(sessionid, startDate, endDate) {
    return dbm.use(
        getSessionBySessionid(sessionid),
        getUserListBySession,
        recordsAggregation(startDate, endDate),
        weeklyReport
    );
}

function getReportsByMonth(sessionid, startDate) {
    var start = moment(startDate);
    if (start.day() != 1) {
        start.add(1, 'w');
    }
    var timeNode_1 = start.valueOf();
    var timeNode_2 = start.add(1, 'w').valueOf();
    var timeNode_3 = start.add(1, 'w').valueOf();
    var timeNode_4 = start.add(1, 'w').valueOf();
    var timeNode_5 = start.add(1, 'w').valueOf();
    return dbm.use(
        getSessionBySessionid(sessionid),
        getUserListBySession
    ).then(function(userList) {
        return dbm.parallel(
            function() {
                return recordsAggregation(timeNode_1, timeNode_2).call(this, userList).then(weeklyReport);
            },
            function() {
                return recordsAggregation(timeNode_2, timeNode_3).call(this, userList).then(weeklyReport);
            },
            function() {
                return recordsAggregation(timeNode_3, timeNode_4).call(this, userList).then(weeklyReport);
            },
            function() {
                return recordsAggregation(timeNode_4, timeNode_5).call(this, userList).then(weeklyReport);
            }
        ).then(function(reportsArray) {
            return reportsArray;
        });
    });
}

function ReportModule() {

}

ReportModule.prototype = {
    punch : punch,
    deleteRecord : deleteRecord,
    updateRecord : updateRecord,
    recentRecords : recentRecords,
    searchRecords : searchRecords,
    showUsersForDelegate : showUsersForDelegate,
    delegate : delegate,
    getReportsByWeek : getReportsByWeek,
    getReportsByMonth : getReportsByMonth
};

module.exports = ReportModule;
