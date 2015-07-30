var Q = require('q');
var crypto = require('crypto');
var nobi = require('nobi');
var config = require('./config')();

function ActionUtils() {
}

ActionUtils.prototype.jadeAction = function(templatename, data) {
    return {
        template: templatename,
        type: 'jade',
        execute: function(req, res, next) {
            return Q(data);
        }
    };
};

ActionUtils.prototype.apiAction = function(data) {
    return {
        type: 'api',
        execute: function(req, res, next) {
            return Q(data);
        }
    };
};

function CryptoUtils() {
}

CryptoUtils.prototype.sha = function(text) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(text);
    return sha256.digest('hex');
};

var signer = nobi(config.get('appKey'));
CryptoUtils.prototype.signer = function() {
    return signer;
};

CryptoUtils.prototype.verify = function(key, signiture) {
    var key_sig = key + "." + signiture;
    return key === signer.unsign(key_sig);
};

function Utils() {
    return {
        actions : new ActionUtils(),
        crypto : new CryptoUtils(),
        wrap : function(obj) { return function(){return obj; };},
        safeBase64: function(base64) {
            return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        },
        unsafeBase64: function(base64) {
            var padding = "===";
            var length = base64.length + padding.length;
            base64 = (base64 + padding).slice(0, length -(length % 4));
            return base64.replace(/-/g, '+').replace(/_/g, '/');
        }
    };
}


module.exports = Utils();
