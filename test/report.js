var assert = require('assert');
var Action = require('../lib/common/action');
var MockExpress = require('mock-express');
var utils = require('../lib/common/utils');

var app = MockExpress();

var userReportAction = Action.getAction('reports.userReports');
app.post('/api/report', Action.render(userReportAction));

describe('Report Action', function(){
    describe('#report.userReport --- api', function(){
        it('should return user summary report', function(done){
            var req = utils.actions.mockRequest({
                body: {
                    type: 'summary',
                    userid: 'ln1',
                    startDate: '2015-07-01',
                    endDate: '2015-07-29'
                }
            }, app);
            var res = utils.actions.mockResponse(function(err, r){
                console.log(r.data);
                done();
            }, app);
            app.invoke('post', '/api/report', req, res);
        });
    });
});
