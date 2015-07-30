var MockExpress = require('mock-express');
var assert = require('assert');

var app = MockExpress();
var Action = require('../lib/common/action');

app.get('/login', Action('login.view'));

describe("test login action", function(){
    describe('login#view', function(){
        it('should show jade template', function(done){
            var req = app.makeRequest({'host':'att.adminsys.us'});
            var res = app.makeResponse(function(err, response){
                assert.equal(response.model.title, 'AdminSys Inc.');
            });
            app.invoke('get', '/login', req, res);
            done();
        });
    })
});
