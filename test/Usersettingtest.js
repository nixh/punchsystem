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

var staffSettingViewAction = Action.getAction('Settings.staffSettingView');
app.get('/settings', Action.render(staffSettingViewAction));

describe('test staffSetting action',function(){
    describe('staffSetting#main',function(){
        it ('should show jade template', function(done) {
            var req = app.makeRequest();
            wrapRequest(req, {'cookies': { sessionid: 'a6fe8c70-2713-11e5-b55d-ff9bc9b1b763'}});
            var res = app.makeResponse(function(err, response){
                var compiler = jade.compileFile(getTemplatePath(staffSettingViewAction.template));        
                compiler(response.model);
                assert.equal(response.model.title, 'AdminSys Inc.')
                done();
            });
            app.invoke('get', '/settings', req, res);
        });
    })
});



var supSettingViewAction = Action.getAction('Settings.supSettingView');
app.get('/supervisor/settings', Action.render(staffSettingViewAction));

describe('test supSetting action',function(){
    describe('supSetting#main',function(){
        it ('should show jade template', function(done) {
            var req = app.makeRequest();
            wrapRequest(req, {'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}});
            var res = app.makeResponse(function(err, response){
                var compiler = jade.compileFile(getTemplatePath(supSettingViewAction.template));        
                compiler(response.model);
                assert.equal(response.model.title, 'AdminSys Inc.')
                done();
            });
            app.invoke('get', '/supervisor/settings', req, res);
        });
    })
});

var setEmailViewAction = Action.getAction('Settings.setEmailView');
app.get('/supervisor/sendemail', Action.render(staffSettingViewAction));

describe('test supSetting action',function(){
    describe('supSetting#setEmailView',function(){
        it ('should show jade template', function(done) {
            var req = app.makeRequest();
            wrapRequest(req, {'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}});
            var res = app.makeResponse(function(err, response){
                var compiler = jade.compileFile(getTemplatePath(setEmailViewAction.template));        
                compiler(response.model);
                assert.equal(response.model.title, 'AdminSys Inc.')
                done();
            });
            app.invoke('get', '/supervisor/sendemail', req, res);
        });
    })
});

var setRateViewAction = Action.getAction('Settings.setRateView');
app.get('/supervisor/setrate', Action.render(staffSettingViewAction));

describe('test supSetting action',function(){
    describe('supSetting#setRateView',function(){
        it ('should show jade template', function(done) {
            var req = app.makeRequest();
            wrapRequest(req, {'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}});
            var res = app.makeResponse(function(err, response){
                console.log(response)
                var compiler = jade.compileFile(getTemplatePath(setRateViewAction.template));        
                compiler(response.model);
                assert.equal(response.model.title, 'AdminSys Inc.')
                done();
            });
            app.invoke('get', '/supervisor/setrate', req, res);
        });
    })
});

var supChangePassAction = Action.getAction('Settings.supChangePass');
app.post('/supervisor/settings', Action.render(staffSettingViewAction));

describe('test staffSetting action',function(){
    describe('staffSetting#changePass',function(){
        it ('should show jade template', function(done) {
            var req = app.makeRequest();
            wrapRequest(req, {'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'},body:{oldpass:"123",newpass:'123'}});
            var res = app.makeResponse(function(err, response){
                console.log(response)
                var compiler = jade.compileFile(getTemplatePath(supChangePassAction.template));       
                compiler(response.model);
                assert.equal(response.model.title, 'AdminSys Inc.')
                done();
            });
            app.invoke('post', '/supervisor/settings', req, res);
        });
    })
});




