var path = require('path');
var config = require('./config')();
var logger = require('../../logger');

function Action(actionName) {
    if (!actionName)
        throw new Error('must specify an actionName');
    var basePath = config.get('actionPath');
    var actionBasePath = path.resolve(__dirname, "../../", basePath);
    var actions = actionName.split(".");
    if (actions.length > 2)
        throw new Error('action should be like actionName[.methodName]');
    var name = actions.splice(0, 1)[0];
    var method = actions.join('.');
    var action = require(path.join(actionBasePath, name));
    if (method) {
        action = action[method];
    }
    return render(action);
}

function validate(data, res) {
    if (!data)
        data = {};
    if (!data.title)
        data.title = "AdminSys Inc.";
    return data;
}

function i18n(data, res) {
    if (!data.tr)
        data.tr = res.__;
}

function render(action) {
    return function(req, res, next) {
        var type = action.type;
        var promise = action.execute(req, res, next);
        promise.fail(function(err) {
            next(err);
        }).done(function(finalData) {
            if (type === 'jade') {
                var template = action.template;
                finalData = validate(finalData);
                i18n(finalData, res);
                return res.render(template, finalData);
            } else if (type === 'api') {
                res.type('json');
                return res.end(finalData);
            } else if (type === 'redirect') {
                return res.redirect(302, finalData);
            }
        });
    };
}

module.exports = Action;
