var MockExpress = require('mock-express');
var assert = require('assert');
var jade = require('jade');
var path = require('path');
var _ = require('underscore');
var utils = require('../lib/common/utils')
var i18n = require('i18n');
var compiler = utils.actions.complieTemplate;
compiler = compiler.bind(utils.actions);
var mockrequest = utils.actions.mockRequest;
mockrequest = mockrequest.bind(utils.actions);

i18n.configure({
    locales: ['cn', 'en'],
    defaultLocale: 'cn',
    directory: path.join(__dirname, '../i18n/locales'),
});

function getTemplatePath(templateName) {
    return path.join(__dirname, "../views", templateName+".jade");
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
            var req = mockrequest({'cookies': { sessionid: 'a6fe8c70-2713-11e5-b55d-ff9bc9b1b763'}},app);
            var res = app.makeResponse(function(err, response){
                compiler(staffSettingViewAction.template, response.model);
                done();
            });
            app.invoke('get', '/settings', req, res);
        });
    })
});



var supSettingViewAction = Action.getAction('Settings.supSettingView');
app.get('/supervisor/settings', Action.render(supSettingViewAction));

describe('test supSetting action',function(){
    describe('supSetting#main',function(){
        it ('should show jade template', function(done) {
            var req = mockrequest({'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}, header:{test:123}},app);
            var res = app.makeResponse(function(err, response){
                compiler(supSettingViewAction.template, response.model);
                done();
            });
            app.invoke('get', '/supervisor/settings', req, res);
        });
    })
});

var setEmailViewAction = Action.getAction('Settings.setEmailView');
app.get('/supervisor/sendemail', Action.render(setEmailViewAction));

describe('test supSetting action',function(){
    describe('supSetting#setEmailView',function(){
        it ('should show jade template', function(done) {
            var req = mockrequest({'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}},app);
            var res = app.makeResponse(function(err, response){
                compiler(setEmailViewAction.template,response.model);
                done();
            });
            app.invoke('get', '/supervisor/sendemail', req, res);
        });
    })
});

var setRateViewAction = Action.getAction('Settings.setRateView');
app.get('/supervisor/setrate', Action.render(setRateViewAction));

describe('test supSetting action',function(){
    describe('supSetting#setRateView',function(){
        it ('should show jade template', function(done) {
            var req =  mockrequest({'cookies': { sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'}},app);
            var res = app.makeResponse(function(err, response){
                compiler(setRateViewAction.template,response.model);
                done();
            });
            app.invoke('get', '/supervisor/setrate', req, res);
        });
    })
});

var supChangePassAction = Action.getAction('Settings.supChangePass');

app.post('/supervisor/settings', Action.render(supChangePassAction));

describe('test staffSetting action',function(){
    describe('staffSetting#changePass',function(){
        it ('should show jade template', function(done) {
            var req = mockrequest({
                'cookies': {
                    sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'
                },body: {
                    oldpass:"123",
                    newpass:'123'
                }
            },app);

            var res = app.makeResponse(function(err, response){

                var html = compiler(supChangePassAction.template,response.model);
                done();
            });
            res.__ = i18n.__;
            app.invoke('post', '/supervisor/settings', req, res);
        });
    })
});


var setEmailAction = Action.getAction('Settings.setEmail');
app.post('/supervisor/sendemail', Action.render(setEmailAction));

describe('test staffSetting action',function(){
    describe('staffSetting#changePass',function(){
        it ('should show jade template', function(done) {
            var req = mockrequest({
                body: {
                    timePeriod:'weekly',
                    receiveEmails:'dsj77222@gmail.com',
                    enableEmail:1
                },'cookies': {
                    sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'
                }

            },app);

            var res = app.makeResponse(function(err, response){
                compiler(setEmailAction.template,response.model);

                done();
            });
            app.invoke('post', '/supervisor/sendemail', req, res);
        });
    })
});

var setRateAction = Action.getAction('Settings.setRate');
app.post('/supervisor/setrate', Action.render(setRateAction));

describe('test supSetting action',function(){
    describe('supSetting#setRate',function(){
        it ('should show jade template', function(done) {
            var req =  mockrequest( {
                'cookies': {
                    sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'
                },body: {
                    newrate:'30',
                    overtime:'2',
                    enablerate:1
                }
            },app);
            var res = app.makeResponse(function(err, response){
                compiler(setRateAction.template,response.model);
                done();
            });
            app.invoke('post', '/supervisor/setrate', req, res);
        });
    })
});

var emailSwitchAction = Action.getAction('Settings.emailSwitch');
app.post('/enableEmail/:1', Action.render(emailSwitchAction));

describe('test supSetting action',function(){
    describe('supSetting#setRate',function(){
        it ('should show jade template', function(done) {
            var req =  mockrequest( {
                'cookies': {
                    sessionid: 'f39efc70-3629-11e5-a55f-9be434ab7853'
                },body: {
                    newrate:'30',
                    overtime:'2',
                    enablerate:1
                }
            },app);
            var res = app.makeResponse(function(err, response){
                compiler(emailSwitchAction.template,response.model);
                done();
            });
            app.invoke('post', '/enableEmail/:1', req, res);
        });
    })
});
