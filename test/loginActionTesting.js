var MockExpress = require('mock-express');
var assert = require('assert');
var jade = require('jade');
var path = require('path');
var _ = require('underscore');

function getTemplatePath(templateName) {
    return path.join(__dirname, "../views", templateName+".jade")
}

function wrapRequest(req, map) {
    _.extend(req, map);
}

var app = MockExpress();

var Action = require('../lib/common/action');

var loginViewAction = Action.getAction('login.view');
app.get('/login', Action.render(loginViewAction));

describe("test login action", function(){
    describe('login#view', function(){
        it('should show jade template', function(done){
            var req = app.makeRequest({'host':'att.adminsys.us'});
            var res = utils.actions.mockResponse(function(err, response){
                var compiler = jade.compileFile(getTemplatePath(loginViewAction.template));
                compiler(response.model)
                assert.equal(response.model.title, 'AdminSys Inc.');
                done();
            }, app);
            app.invoke('get', '/login', req, res);
        });
    })
});











