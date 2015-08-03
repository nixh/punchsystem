var utils = require('../lib/common/utils');
var actionUtils = utils.actions;
var rportModule = require('../lib/module/reportModule');
var rm = new reportModule();
var Q = require('q');

Reports = {};


Reports.showRecentRecordsBySupervisor = {
    type: 'jade',
    template: './yongred/punch_report',
    execute: function(req, res, next) {
        var userid = req.params.userid;
        var recs = rm.recentRecords(userid);
        return recs.then(function(records) {
            var jsonData = {};
            jsonData.su = true;
            jsonData.records = records;
            return records;
        });
    }
};

Reports.showRecentRecordsByStaff = {
    type: 'jade',
    template: './yongred/punch_report',
    execute: function(req, res, next) {
        var userid = req.params.userid;
        var recs = rm.recentRecords(userid);
        return recs.then(function(records) {
            var jsonData = {};
            jsonData.su = false;
            jsonData.records = records;
            return records;
        });
    }
};

Reports.searchRecordsBySupervisor = {
    type: 'jade',
    template: './yongred/punch_report',
    execute: function(req, res, next) {
        var userid = req.params.userid;
        var startDate = Date.parse(req.params.startDate);
        var endDate = Date.parse(req.params.endDate);
        var recs = rm.searchRecords(userid, startDate, endDate);
        return recs.then(function(records) {
            var jsonData = {};
            jsonData.su = true;
            jsonData.records = records;
            return jsonData;
        });
    }
};

Reports.searchRecordsByStaff =  {
    type: 'jade',
    template: './yongred/punch_report',
    execute: function(req, res, next) {
        var userid = req.params.userid;
        var startDate = req.params.startDate;
        var endDate = req.params.endDate;
        var recs = rm.searchRecords(userid, startDate, endDate);
        return recs.then(function(records) {
            var jsonData = {};
            jsonData.su = false;
            jsonData.records = records;
            return jsonData;
        });
    }
};
//About the use of redirect and api
Reports.updateRecords =  {
    type: 'redirect',
    execute: function(req, res, next) {
        var _id = req.params._id;
        var type = req.body.type;
        var userid = req.body.userid;
        var date = req.body.date;

        var format = 'YYYY-MM-DD hh:mm A';
        var query = {userid: userid, _id: _id};
        var newRec = {};
        
    }
};
