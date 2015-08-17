var Q = require('q');
var utils = require('../lib/common/utils');
var factory = require('../lib/module/moduleFactory')();
var config = require('../lib/common/config')();
var moment = require('moment');
var _ = require('underscore');

var vocation = {};

var vm = factory.get('vocationModule');

vocation.newVocation = {
    type: 'api',
    execute: function(req, res, next) {
        var userid = req.body.userid;
        if(!userid) throw new Error('lack params.');

    }
};

vocation.checkVocation = {
    type: 'api',
    execute: function(req, res, next) {
        var status = req.params.status;
        if(status) {
            var availableStatus = ['pending', 'approved', 'rejected'];
            var any = _.any(availableStatus, function(st){ return st === status; });
            if(!any)
                throw new Error('incorrect status.');
        }
        var userid = req.params.userid;
        if(!userid) throw new Error('lack params.');
        return vm.checkVocations(userid, status);
    }
};

vocation.cancelVocation = {
    type: 'api',
    execute: function(req, res, next) {
        var userid = req.body.userid;
        if(!userid) throw new Error('lack params.');
        var vocation_id = req.body.vocationid;
        if(!vocation_id) throw new Error('lack params.');
        return vm.cancelVocation(userid, vocation_id);
    }
};
