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
var fformat = "YYYY-MM-DD hh:mm:ss";
var i18n = require('i18n');
var path = require('path');

i18n.configure({
    locales: ['cn', 'en'],
    defaultLocale: 'cn',
    directory: path.join(__dirname, "../../i18n/locales")
});

module.exports = RecordModule;

function RecordModule() {}

RecordModule.prototype._private = {}

RecordModule.prototype.getUserRecords = function(userid, from, to) {
    var from = moment(from, format).valueOf();
    var to = moment(to, format).valueOf();
    return dbm.use(utils.wrap(userid), aggregateUserRecords(from, to))
              .then(regulateRecords);
}

RecordModule.prototype.getUserRecordsDetails = function(userid, from, to) {
    var from = moment(from, format).valueOf();
    var to = moment(to, format).valueOf();
    var query = dbm.query('records', { 
                    userid: userid, 
                    inDate: { $gte: from }, 
                    outDate: { $lte: to } });
    return dbm.use(query).then(regulateRecordsDetails);
}

function findCompUsers(compid) {
    return dbm.query('users', {compid:compid});
}

function aggregateUserRecords(startDate, endDate) {
    return function(users) {
        var userIdList = [];
        if(_.isArray(users)) {
            userIdList = users.map(function(u){
                return u.userid;
            });
        } else if(users.userid) {
            userIdList.push(users.userid);
        } else if(typeof users === 'string') {
            userIdList.push(users);
        } else
            throw new Error('invalid_user arguments!');

        var companyRecordsAggregation = [
            { $match: {
                userid: { $in: userIdList },
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
        return dbm.aggregate('records', companyRecordsAggregation).call(this);
    }
}

RecordModule.prototype.getCompanyRecords = function(compid, from, to) {
    var from = moment(from, format).valueOf();
    var to = moment(to, format).valueOf();
    return dbm.use(findCompUsers(compid), aggregateUserRecords(from, to))
              .then(regulateRecords);
}

function quote(str) {
    return '"' + str + '"';
}


function translate(lang) {
    i18n.setLocale(lang);
    return function(str) {
        return i18n.__(str);
    }
}

RecordModule.prototype.detailsToCSV = function(records, lang) {
    if(!lang) lang = 'cn';
    var title = ['"id"', '"from"', '"to"', '"rate"', '"workhours"', '"payment"'];
    title = title.map(translate(lang));
    var csv = title.join(',') + "\n";
    var body = [];
    records.forEach(function(r){
        var line = [quote(r.userid), quote(r.inDate), quote(r.outDate),
                    quote("$" + r.hourlyRate), quote(r.workhours + " HR"), 
                    quote("$" + (r.hourlyRate * r.workhours))];
        body.push(line.join(','));
    });
    return csv += body.join('\n');
}

RecordModule.prototype.summaryToCSV = function(reports, lang) {
    if(!lang) lang = 'cn';
    var title = ['"id"', '"from"', '"to"', '"rate_exp"', '"payment"'];
    title = title.map(translate(lang));
    var csv = title.join(',') + "\n";
    var body = [];
    var regex = /\$(.+)$/;
    reports.forEach(function(r){
        var rateExp = r.rates.map(function(rateObj){
            var wh = moment.duration(rateObj.workhours).asHours();
            var rate = rateObj.rate;
            var exp = "%s HR * %s USD/HR = $%s";
            return util.format(exp, wh, rate, wh*rate);
        });

        var sum = rateExp.reduce(function(p, v){
            if(p === 0)
                return parseFloat(v.match(regex)[1]);
            return parseFloat(p.match(regex)[1]) + parseFloat(v.match(regex)[1]); 
        }, 0);

        var line = [quote(r.userid), quote(r.from), quote(r.to),
                    quote(rateExp.join(',')), quote("$"+sum)];
        body.push(line.join(','));
    });
    return csv += body.join('\n');
}

function regulateRecordsDetails(records) {
    return records.map(function(rec){
        rec.workhours = moment.duration(rec.outDate-rec.inDate).asHours();
        rec.inDate = moment(rec.inDate).format(fformat);
        rec.outDate = moment(rec.outDate).format(fformat);
        return rec;
    });
}

function regulateRecords(reports) {
    return reports.map(function(r){
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
//rm.getUserRecordsDetails('ln1', "2015-07-01", "2015-07-30").then(function(reports){
//    console.log(rm.detailsToCSV(reports));
//});
