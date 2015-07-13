var utils = require('./utils');
var db = require('./db/db');
var _ = require('underscore');
var monk = require('monk');

function validate(record) {

}

function insertRecord(record, recordsCol) {
    return recordsCol.insert(record);
}

function updateRecord(query, record, recordsCol) {
    return recordsCol.findAndModify(query, { $set: record }, { new: true });
}


//********** Functions for delete **************//
function deleteRecords(reportid, callback) {
    var db = this.db;
    var records =db.get('records');
    var query = {reportid: reportid};
    records.remove(query, function(err, docs) {
        var msg = "Successfully delete records";
        if (err) {
            msg = "Failed to delete record";
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
        console.log(recs);
        if (err) {
            res.send('Can not get records, try again!');
        } else {
            jsonData = {};
            jsonData.su = su;
            jsonData.records=[];
            recs.forEach(function(rec, index) {
                var record = {};
                record.reportid = rec.reportid;
                record.inDate = rec.inDate;
                record.outDate = rec.outDate;
                record.hourlyrate = rec.hourlyRate;
                jsonData.records.push(record);
            });
            var userid = query.userid;
            db.get("users").findOne({userid: userid}, function(err, docs) {
                console.log(docs);
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
        var msg = "Successfully update the records";
        if (err) {
            msg = "Failed to update the records";
        }
        callback(msg);
    });
}
//*********************************************//

function Module(settings) {
    _.extend(this, settings);
    if(!this.db) {
        this.db = monk(utils.getConfig('mongodbPath'));
    }
    //db = this.db;
}

Module.prototype = {
    delete : deleteRecords,
    searchRecords : searchRecords,
    modify : updateRecords
}

module.exports = Module
