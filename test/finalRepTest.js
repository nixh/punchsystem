var MockExpress = require('mock-express');
var assert = require('assert');
var _ = require('underscore');
var utils = require('../lib/common/utils');
var compiler = utils.actions.complieTemplate;
compiler = compiler.bind(utils.actions);
var mockrequest = utils.actions.mockRequest;
mockrequest = mockrequest.bind(utils.actions);

var app = MockExpress();
var Action = require('../lib/common/action');

var showRecentRecordsBySupervisorAction = Action.getAction('Reports.showRecentRecordsBySupervisor');
app.get('/rencentRecords', Action.render(showRecentRecordsBySupervisorAction));

describe('Test the action of showing Recent records by supervisor', function() {
    describe('#rencentRecords(idObj)', function() {
        it('should show the recent records of a specific user', function(done) {
            var req = mockrequest({'userid': 'LoginName_4'}, app);
            var res = app.makeReponse(function(err, response) {
                compiler(showRecentRecordsBySupervisorAction.template, response.model);
                done();
            });
            app.invoke('get', '/rencentRecords', req, res);
        });
    });
});
