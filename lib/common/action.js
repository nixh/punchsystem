var path = require('path');
var config = require('./config')();
var logger = require('../../logger');
var util = require('util');

Action.getAction = function(actionName) {
    if(!actionName)
        throw new Error('must specify an actionName');
    var basePath = config.get('paths->action');
    var actionBasePath = path.resolve(__dirname, "../../", basePath);
    var actions = actionName.split(".");
    var name = actions.splice(0, 1)[0];
    var method = actions.join('.');
    var action = require(path.join(actionBasePath, name));
    if(method) {
        eval("action = action."+method);
    }
    return action;
}

Action.render = function(action) {
    return render(action);
}

function Action(actionName) {
    var action = Action.getAction(actionName);
    return render(action);
}

function validate(data, res) {
    if(!data)
        data = {};
    if(!data.title)
        data.title = "AdminSys Inc.";
    return data;
}

function i18n(data, res) {
    if(!data.tr)
        data.tr = res.__;
}

function render(action) {
    return function(req, res, next) {
        res.header('X-Powered-By', 'Server AdminSys Inc.')
        var type = action.type;
        if(type === 'api')
            res.type('json');

        var promise = null;
        try {
            promise = action.execute(req, res, next);
        } catch(err) {
            if(type === 'api') {
                return res.send({
                    status: 'fail',
                    msg: err.message,
                    err: {},
                    success: false
                });
            } else {
                throw err;
            }
        }
        promise.then(function(finalData){
            if(type === 'jade') {
                var template = action.template;
                finalData = validate(finalData);
                i18n(finalData, res);
                res.render(template, finalData);
                return;
            } else if(type === 'api') {
                res.send(finalData);
                return;
            } else if(type === 'redirect') {
                res.redirect(302, finalData);
                return;
            }
        }).fail(function (err){
            if(type === 'jade' && next) {
                next(err);
            } else if(type === 'api') {
                res.send({
                    status: 'fail',
                    msg: err.message,
                    err: {},
                    success: false
                });
            }
        });
    };
}

module.exports = Action;
