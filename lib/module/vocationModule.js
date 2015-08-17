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

module.exports = VocationModule;

function VocationModule() {
}

function getUser(userid) {
    return dbm.load('users', userid, 'userid');
}
VocationModule.prototype._private = {};

var newVocationRequest = function(userid, startDate, endDate, reason) {
    var start = moment(startDate, format).valueOf();
    var end = moment(endDate, format).endOf('day').valueOf();
    return dbm.use(getUser(userid), utils.extract('compid'), function(compid){
        var vocation = {
            userid: userid,
            compid: compid,
            startDate: start,
            endDate: end,
            reason: reason,
            status: 'pending',
            applyDate: new Date().getTime()
        };
        return dbm.insert('vocations', vocation).call(this);
    });
};

function getVocation(id) {
    return dbm.load('vocations', id);
}

function processRequest(vocation_id, status, message) {
    return function(user) {
        if(!user.owner) {
            throw new Error('no_previlege');
        }
        return dbm.updateOne('vocations', {_id: vocation_id}, {
                    $set: {
                        status: status,
                        response: {
                            msg: message,
                            time: new Date().getTime(),
                            ownerName: user.name,
                            ownerId: user.userid
                        }
                    }
                }).call(this);
    };

}

function cancelRequest(userid) {
    return function(vocation) {
        if(userid !== vocation.userid) {
            throw new Error('the request can only be canceled by its applicant.');
        }
        if(vocation.status !== 'pending') {
            throw new Error('you can cancel'+ 
                            ' vocation request'+
                            ' only if its status is pending');
        }
        return dbm.deleteOne('vocations', {_id: vocation._id}).call(this);
    }
}

var rejectVocation = function(userid, vocation_id, rejectReson) {
    return dbm.use(getUser(userid), processRequest(vocation_id, 'rejected', rejectReson));
};

var approveVocation = function(userid, vocation_id, message) {
    return dbm.use(getUser(userid), processRequest(vocation_id, 'approved', message));
};

var cancelVocation = function(userid, vocation_id) {
    return dbm.use(getVocation(vocation_id), cancelRequest(userid));

}

var listVocaitons = function(userid, status) {
    return dbm.use(getUser(userid), utils.extract('compid'),function(compid){
        return dbm.query('vocations', {compid: compid, status: status}).call(this);
    });
};

var listpendingVocaitons = function(userid) {
    return listVocaitons(userid, 'pending');
}

var listprocessedVocations = function(userid) {
    return listVocaitons(userid, {$ne: 'pending'});
}

var checkVocations = function(userid, status) {
    var query = {
        userid: userid
    };
    if(status) {
        query.status = status;
    }
    var options = {
        sort: { applyDate: -1 }
    };
    return dbm.use(dbm.query('vocations', query, options));
    
};

VocationModule.prototype.newVocationRequest = newVocationRequest;
VocationModule.prototype.rejectVocation = rejectVocation;
VocationModule.prototype.approveVocation = approveVocation;
VocationModule.prototype.cancelVocation = cancelVocation;
VocationModule.prototype.listpendingVocaitons = listpendingVocaitons;
VocationModule.prototype.listprocessedVocations = listprocessedVocations;
VocationModule.prototype.listVocaitons = listVocaitons;
VocationModule.prototype.checkVocations = checkVocations;

function show(ret) {
    console.log(ret);
}
