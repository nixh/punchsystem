var config = require('./config.json');
var nobi = require('nobi');
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
                if(req.db) {
                    console.log('db closed!')
                    req.db.close();
                }
                return res.render(tmplPath, data);
            }
        },
        getConfig: findConfig,
        getSigner: function(key) {
            if(!key)
                return nobi(config.appKey);
            return nobi(key);
        },
        base64URLSafeEncode : function(base64) {
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        },
        base64URLSafeDecode : function(base64safe) {
            var padding = "===";
            var length = base64safe.length + padding.length;
            base64safe = (base64safe + padding).slice(0, length -(length % 4));
            return base64safe.replace(/-/g, '+').replace(/_/g, '/');
        } 
    }
}

var utils = new Utils();

module.exports = utils;
