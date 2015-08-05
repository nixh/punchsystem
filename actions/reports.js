var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var Q = require('q');
var factory = require('../lib/module/moduleFactory')();
var Action = require('../lib/common/action');
var email = require('../email')();
var recordModule = factory.get('recordModule');
var userModule = factory.get('userModule');
var logger = require('../logger');

function summaryRecords(userid, from, to) {
    return recordModule.getUserRecords(userid, from, to);
}

function detailsRecords(userid, from, to) {
    return recordModule.getUserRecordsDetails(userid, from, to);
}

var reports = {};

reports.userReports = {
    type: 'api',
    execute: function(req, res, next) {
        var userid = req.body.userid;
        var type = req.body.type;
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        if(type === "details") {
            return summaryRecords(userid, startDate, endDate);
        }
        return detailsRecords(userid, startDate, endDate);
    }
};

reports.emailDetailReportsCSV = {
    type: 'api',
    execute: function(req, res, next) {
        var userid = req.body.userid;
        var from = req.body.startDate;
        var to = req.body.endDate;
        var add = req.body.email;
        return detailsRecords(userid, from, to)
            .then(function(reportObj){
                var csv = recordModule.detailsToCSV(
                                reportObj.user, 
                                reportObj.records);
                var deferred = Q.defer();
                email.sendEmail(add, '', 'AdminSys Inc. --- Detail Report', 
                    "Hello, " + userid + ".<br> This is your report.",
                    [csv], deferred.makeNodeResolver());
                return deferred.promise;
            }).then(function(msg){
                return {
                    status: 'success',
                    msg: msg
                };
            });
    }
};

module.exports = reports;
