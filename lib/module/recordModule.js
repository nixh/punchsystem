var _ = require('underscore');
var util = require('util');
var utils = require('../common/utils');
var dbm = require('../common/db');
var config = require('../common/config')();
var logger = require('../../logger');
var Q = require('q');
var fs = require('fs');
var factory = require('./moduleFactory')();
var moment = require('moment');
var format = "YYYY-MM-DD";
var fformat = "YYYY-MM-DD hh:mm:ss A";
var i18n = require('i18n');
var path = require('path');

i18n.configure({
    locales: ['cn', 'en'],
    defaultLocale: 'cn',
    directory: path.join(__dirname, "../../i18n/locales")
});

module.exports = RecordModule;

function RecordModule() {}

RecordModule.prototype._private = {};

RecordModule.prototype.getUserRecords = function(userid, from, to) {
    from = moment(from, format).valueOf();
    to = moment(to, format).valueOf();
    return dbm.use(utils.wrap(userid), aggregateUserRecords(from, to));
};

RecordModule.prototype.getUserRecordsDetails = function(userid, from, to) {
    from = moment(from, format).valueOf();
    to = moment(to, format).valueOf();
    var recordQuery = dbm.query('records', {
        userid: userid,
        inDate: {
            $gte: from
        },
        outDate: {
            $lte: to
        }
    });
    var userQuery = dbm.load('users', userid, 'userid');
    return dbm.parallel(recordQuery, userQuery).spread(function(records, user) {
        records = regulateRecordsDetails(records);
        return {
            user: user,
            records: records
        };
    });
};

function findCompUsers(compid) {
    return dbm.query('users', {
        compid: compid
    }).call(this);
}



function aggregateUserRecords(startDate, endDate) {
    return function(users) {
        var userIdList = [];
        if (_.isArray(users)) {
            userIdList = users.map(function(u) {
                return u.userid;
            });
        } else if (users.userid) {
            userIdList.push(users.userid);
        } else if (typeof users === 'string') {
            userIdList.push(users);
        } else
            throw new Error('invalid_user arguments!');

        var companyRecordsAggregation = [{
            $match: {
                userid: {
                    $in: userIdList
                },
                inDate: {
                    $gte: startDate
                },
                outDate: {
                    $ne: null,
                    $lte: endDate
                }
            }
        }, {
            $sort: {
                inDate: 1
            }
        }, {
            $group: {
                _id: {
                    rate: '$hourlyRate',
                    userid: '$userid'
                },
                totalIn: {
                    $sum: '$inDate'
                },
                totalOut: {
                    $sum: '$outDate'
                },
                from: {
                    $first: '$inDate'
                },
                to: {
                    $last: '$outDate'
                }
            }
        }, {
            $group: {
                _id: {
                    userid: '$_id.userid'
                },
                from: {
                    $first: '$from'
                },
                to: {
                    $last: '$to'
                },
                totalHours: {
                    $sum: {
                        $subtract: ['$totalOut', '$totalIn']
                    }
                },
                avgRate: {
                    $avg: '$_id.rate'
                },
                rates: {
                    $push: {
                        rate: '$_id.rate',
                        workhours: {
                            $subtract: ['$totalOut', '$totalIn']
                        }
                    }
                }
            }
        }, {
            $project: {
                userid: '$_id.userid',
                from: '$from',
                to: '$to',
                totalHours: '$totalHours',
                rates: '$rates',
                avgRate: '$avgRate',
                _id: 0
            }
        }];
        return dbm.aggregate('records', companyRecordsAggregation).call(this)
            .then(function(records) {
                var recordsObj = {};
                recordsObj.records = regulateRecords(records);
                recordsObj.users = users;
                return recordsObj;
            });
    };
}

RecordModule.prototype.getCompanyRecordsByUserId = function(userid, from, to) {
    from = moment(from, format).valueOf();
    to = moment(to, format).valueOf();
    return dbm.use(dbm.load('users', userid, 'userid'),
        utils.extract('compid'),
        findCompUsers,
        aggregateUserRecords(from, to));

};

RecordModule.prototype.getCompanyRecords = function(compid, from, to) {
    from = moment(from, format).valueOf();
    to = moment(to, format).valueOf();
    return dbm.use(utils.wrap(compid), 
                   findCompUsers, 
                   aggregateUserRecords(from, to));
};

function calculateWeeks(from, to) {
    var start = moment(from, format);
    var end = moment(to, format);
    var peroids = [];
    var startValue = start.valueOf();
    var endValue = end.valueOf();
    if (startValue > endValue) {
        var tpl = 'invalid arguments! to value[%s]' +
            'cant be earlier than from value[%s]';
        var err = util.format(tpl, endValue, startValue);
        throw new Error(err);
    }
    var days = moment.duration(endValue - startValue).asDays();
    while (startValue < endValue) {
        var weekend = start.endOf('isoweek').valueOf();
        if (weekend > endValue) {
            peroids.push({
                start: startValue,
                end: endValue
            });
            return peroids;
        }
        peroids.push({
            start: startValue,
            end: weekend
        });
        startValue = start.add(1, 's').valueOf();
    }
    var weekStart = end.startOf('isoweek').valueOf();
    peroids.push({
        start: weekStart,
        end: endValue
    });
    return peroids;
}

RecordModule.prototype.getCompRecByUidWithOvertime = function(userid, from, to) {

    var peroids = calculateWeeks(from, to);
    var aggregations = peroids.map(function(peroid) {
        return aggregateUserRecords(peroid.start, peroid.end);
    });

    var cid = null;

    return dbm.use(dbm.load('users', userid, 'userid'),
            utils.extract('compid'),
            function(compid) {
                cid = compid;
                return findCompUsers.call(this, cid);
            })
        .then(function(users) {
            var targetAggregations = aggregations.map(function(aggre) {
                return function() {
                    return aggre.call(this, users);
                };
            });
            return dbm.parallel(
                dbm.load('comp_settings', cid, 'compid'),
                targetAggregations
            );
        })
        .then(function(values) {
            var compSettings = values.splice(0, 1);
            var recordsByWeek = values;
            var users = recordsByWeek[0].users;
            recordsByWeek = recordsByWeek.map(function(recObj) {
                return recObj.records;
            });
            return {
                compSettings: compSettings,
                users: users,
                peroids: peroids,
                records: recordsByWeek
            };
        })
        .then(toOvertimeResults);
};

function usersById(id, users) {
    if(!users) throw new Error('empty user list');
    return users.filter(function(u){ return u.userid === id; })[0];
}

function toOvertimeResults(results) {

    var peroids = results.peroids;
    var ret = [];
    peroids.forEach(function(peroid, index){

        var retObj = {};
        ret.push(retObj);
        retObj.start = moment(peroid.start).format(fformat);
        retObj.end = moment(peroid.end).format(fformat);
        var record = results.records[index];
        if(!record || !record.length) {
            return;
        }
        var compOvertime = results.compSettings.overtime || 
                           { threshold: 40, multiplier: 1.5 }; 

        retObj.reports = {};
        record.forEach(function(userRec){

            var userReport = {};
            userReport.from = userRec.from;
            userReport.to = userRec.to;
            userReport.totalHours = userRec.totalHours;

            var userid = userRec.userid;
            var user = usersById(userid, results.users);
            var overtimeSetting = user.overtime || compOvertime;
            var overtime = userReport.totalHours - overtimeSetting.threshold;
            var isOvertime = overtime > 0;

            userReport.userName = user.name;
            userReport.isOvertime = isOvertime;
            userReport.overtimeHours = isOvertime ? overtime : 0;
            userReport.rate = userRec.avgRate;

            userReport.regularPayments = isOvertime ? 
                                            overtimeSetting.threshold * 
                                                userReport.rate : 
                                            userReport.totalHours *
                                                userReport.rate;

            userReport.overtimePayments = isOvertime ? 
                                            userReport.overtimeHours * 
                                                userReport.rate * 
                                                overtimeSetting.multiplier : 
                                            0;
            userReport.totalPayments = userReport.regularPayments + 
                                            userReport.overtimePayments;

            retObj.reports[userRec.userid] = userReport;
        });
    });
    return ret;
}

function quote(str) {
    return '"' + str + '"';
}

function translate(lang) {
    i18n.setLocale(lang);
    return function(str) {
        return i18n.__(str);
    };
}

function isEmtptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}

function accumulateIfExists(target, doc, properties) {
    properties.forEach(function(prop){
        target[prop] += doc[prop];
    });
}

function weeklyDetailsToOverall(reports) {
    var overallReports = {};
    reports.forEach(function(report, index){
        if(!report.reports) return;
        for(var userid in report.reports) {

            var currentReport = report.reports[userid];
            var overallUserReport = overallReports[userid] || {};
            overallReports[userid] = overallUserReport;

            if(isEmtptyObject(overallUserReport)) {
                _.extend(overallUserReport, currentReport);
                continue;
            }

            if(overallUserReport.from > currentReport.from)
                overallUserReport.from = currentReport.from;
            if(overallUserReport.to < currentReport.to)
                overallUserReport.to = currentReport.to;

            accumulateIfExists(overallUserReport, currentReport, 
                               ['overtimeHours', 'totalHours', 
                                'overtimePayments', 'totalPayments']);

        }
    });
    return overallReports;
}

RecordModule.prototype.overtimeOverallToCSV = function(reports, lang) {
    if (!lang) lang = 'en';
    var csv = "";
    var title = "Employee Salary Report From %s To %s";
    title = util.format(title, reports[0].start, reports[reports.length-1].end);
    csv += quote(title) + "\n\n";
    var overallReports = weeklyDetailsToOverall(reports);
    var contentTitle = ['"id"', '"name"', '"from"', 
                        '"to"', '"rate"', '"workhours"', 
                        '"overtimehours"', '"overtimepayment"', 
                        '"payment"'];
    contentTitle = contentTitle.map(translate(lang));
    csv += contentTitle.join(',') + "\n";
    body = [];
    for(var userid in overallReports) {
        var reportObj = overallReports[userid];
        var line = [quote(userid), quote(reportObj.userName),
                    quote(reportObj.from), quote(reportObj.to),
                    quote("$"+reportObj.rate.toFixed(2)), 
                    quote(reportObj.totalHours.toFixed(2)+" HR"),
                    quote(reportObj.overtimeHours.toFixed(2)+ " HR"),
                    quote("$"+reportObj.overtimePayments.toFixed(2)),
                    quote("$"+reportObj.totalPayments.toFixed(2))];
        body.push(line.join(','));
    }
    csv += body.join('\n');
    return csv;
};

RecordModule.prototype.overtimeWeeklyDetailsToCSV = function(reports, lang) {
    if (!lang) lang = 'en';
    var csv = "";
    var title = "Employee Salary Report From %s To %s";
    title = util.format(title, reports[0].start, reports[reports.length-1].end);
    csv += quote(title);
    reports.forEach(function(report, index){
        var timeTitle = "Week %d --- From %s To %s";
        timeTitle = util.format(timeTitle, index+1, report.start, report.end);
        if(csv) {
            csv += "\n\n";
        }
        csv += quote(timeTitle) + "\n";
        var contentTitle = ['"id"', '"name"', '"from"', 
                            '"to"', '"rate"', '"workhours"', 
                            '"overtimehours"', '"overtimepayment"', 
                            '"payment"'];
        contentTitle = contentTitle.map(translate(lang));
        csv += contentTitle.join(',') + "\n";
        body = [];
        if(!report.reports) {
            body.push(quote('empty records'));
        } else {
            for(var userid in report.reports) {
                var reportObj = report.reports[userid];
                var line = [quote(userid), quote(reportObj.userName),
                            quote(reportObj.from), quote(reportObj.to),
                            quote("$"+reportObj.rate.toFixed(2)), 
                            quote(reportObj.totalHours.toFixed(2)+" HR"),
                            quote(reportObj.overtimeHours.toFixed(2)+ " HR"),
                            quote("$"+reportObj.overtimePayments.toFixed(2)),
                            quote("$"+reportObj.totalPayments.toFixed(2))];
                body.push(line.join(','));
            }
        }
        csv += body.join('\n');
    });
    return csv;
};

RecordModule.prototype.detailsToCSV = function(user, records, lang) {
    if (!lang) lang = 'en';
    var title = ['"id"', '"name"', '"from"', '"to"', '"rate"', '"workhours"', '"payment"'];
    title = title.map(translate(lang));
    var csv = title.join(',') + "\n";
    var body = [];
    records.forEach(function(r) {
        var line = [quote(r.userid), quote(user.name),
            quote(r.inDate), quote(r.outDate),
            quote("$" + r.hourlyRate.toFixed(2)), quote(r.workhours.toFixed(2) + " HR"),
            quote("$" + (r.hourlyRate * r.workhours).toFixed(2))
        ];
        body.push(line.join(','));
    });
    return csv += body.join('\n');
};

RecordModule.prototype.summaryToCSV = function(users, reports, lang) {
    if (!lang) lang = 'en';
    var title = ['"id"', '"name"', '"from"', '"to"', '"rate_exp"', '"payment"'];
    title = title.map(translate(lang));
    var csv = title.join(',') + "\n";
    if (!reports || !reports.length) {
        csv += '"' + translate(lang)('empty') + '",,,,,\n';
        return csv;
    }

    var body = [];
    var regex = /\$(.+)$/;
    reports.forEach(function(r) {
        var rateExp = r.rates.map(function(rateObj) {
            var wh = moment.duration(rateObj.workhours).asHours();
            var rate = rateObj.rate ? rateObj.rate : 0;
            var exp = "%s HR * %s USD/HR = $%s";
            return util.format(exp, wh.toFixed(2), rate.toFixed(2), (wh * rate).toFixed(2));
        });
        var sum = rateExp.reduce(function(p, v) {
            var val = parseFloat(v.match(regex)[1]);
            return p + val;
        }, 0);
        var user = users.filter(function(u) {
            return u.userid === r.userid;
        })[0];
        var line = [quote(r.userid), quote(user.name),
            quote(r.from), quote(r.to),
            quote(rateExp.join(',')), quote("$" + sum.toFixed(2))
        ];
        body.push(line.join(','));
    });
    csv += body.join('\n');
    return csv;
};

function regulateRecordsDetails(records) {
    return records.map(function(rec) {
        rec.workhours = moment.duration(rec.outDate - rec.inDate).asHours();
        rec.inDate = moment(rec.inDate).format(fformat);
        rec.outDate = moment(rec.outDate).format(fformat);
        return rec;
    });
}

function regulateRecords(reports) {
    return reports.map(function(r) {
        r.from = moment(r.from).format(fformat);
        r.to = moment(r.to).format(fformat);
        r.totalHours = moment.duration(r.totalHours).asHours();
        r.multipleRate = r.rates.length !== 1;
        return r;
    });
}

function show(result) {
    console.log(result);
    return result;
}

//var rm = factory.get('recordModule');
//rm.getCompRecByUidWithOvertime('ln33', '2015-07-11', '2015-08-10').then(function(ret){
//    console.log(rm.overtimeOverallToCSV(ret));
//});
