var config = require('./config.json');

function findConfig(key, delim) {
    if(!key)
        return;
    if(!delim)
        delim = '->';
    var start = 0;
    var end = 0;
    var result = config;
    var part = key;
    while(end != -1) {
        end = key.indexOf(delim, start);
        if(end == -1) {
            part = key.substring(start);
        } else {
            part = key.substring(start, end);
            start = end+delim.length;
        }
        if(result)
            result = result[part];

    }
    return result;
}

function Utils() {

    return {
        render: function(tmplPath, data) {
            return function(req, res, next) {
                if (!data) data = {};
                data['tr'] = res.__;
                data['redirectTime'] = findConfig('app.config->message.redirectAfter');
                return res.render(tmplPath, data);
            }
        },
        getConfig: findConfig
    }
}

var utils = new Utils();

module.exports = utils;
