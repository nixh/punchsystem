var path = require('path');
var config = require('./config')();

function Action(actionName) {
    if(!actionName)
        throw new Error('must specify an actionName');
    var basePath = config.get('actionPath');
    var actionBasePath = path.resolve(__dirname, "../../", basePath);
    var actions = actionName.split(".");
    if(actions.length > 2)
        throw new Error('action should be like actionName[.methodName]')
    var name = actions.splice(0, 1)[0];
    var method = actions.join('.');
    var action = require(path.join(actionBasePath, name));
    if(method) {
        action = action[method];
    }
    return render(action);
}

function validate(data, res) {
    if(!data)
        data = {};
    if(!data.title)
        data.title = "AdminSys Inc.";
}

function i18n(data, res) {
    if(!data.tr)
        data.tr = res.__;
}

function render(action) {
    return function(req, res, next) {
        var type = action.type;
        var data = action.execute(req, res, next);
        if(type === 'jade') {
            var template = action.template;
            validate(data);
            i18n(data);
            return res.render(template, data);
        } else if(type === 'api') {
            res.type('json');
            return res.end(data);
        } else if(type === 'redirect') {
            return res.redirect(302, data);
        }
    }
}

module.exports = Action;

Action("login.view")

