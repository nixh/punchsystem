var Q = require('q');
var crypto = require('crypto');
var nobi = require('nobi');
var config = require('./config')();
var fs = require('fs');
var ursa = require('ursa');
var path = require('path');
var jade = require('jade');
var _ = require('underscore');
var i18n = require('i18n');

i18n.configure({
    locales: ['cn', 'en'],
    defaultLocale: 'cn',
    directory: path.join(__dirname, "../../i18n")
});

function ActionUtils() {}

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

ActionUtils.prototype.mockRequest = function(map, mockapp) {
    if(!map)
        map = {};
    var req = mockapp.makeRequest(map);
    _.extend(req, map);
    req.get = function(key) {
        if(req.headers && key in req.headers) {
            return req.headers[key];
        }
        return map[key];
    }
    req.params = function(key) {
        if(req.method.toLowerCase() === 'post') {
            if(req.body && key in req.body) {
                return req.body[key];
            }
        }
        if(req.params && key in req.params) {
            return req.params[key];
        }
        if(req.query && key in req.query) {
            return req.query[key];
        }
        return null
    }
    return req;
}

ActionUtils.prototype.mockResponse = function(fn, mockapp) {
    var res = mockapp.makeResponse(fn);
    res.__ = i18n.__;
    return res;
}

ActionUtils.prototype.templatePath = function(templatename) {
    return path.join(__dirname, "../../views", templatename+".jade");
}

var compilers = {};

ActionUtils.prototype.complieTemplate = function(templatename, data) {
    if(compilers[templatename]) {
        return compilers[templatename](data);
    }
    //var templatePath = ActionUtils.prototype.templatePath;
    var tplPath = this.templatePath(templatename);
    var compiler = jade.compileFile(tplPath);
    compilers[templatename] = compiler;
    return compiler(data);
}

function CryptoUtils() {
}

CryptoUtils.prototype.sha = function(text, type) {
    if(!type)
        type = 'hex';
    var sha256 = crypto.createHash('sha256');
    sha256.update(text);
    return sha256.digest(type);
};

var signer = nobi(config.get('appKey'));
CryptoUtils.prototype.signer = function() {
    return signer; 
};

CryptoUtils.prototype.verify = function(key, signiture) {
    var key_sig = key + "." + signiture;
    return key === signer.unsign(key_sig); 
};

var serverKey = fs.readFileSync(path.join(__dirname, "../../certs/serverkey.pem"));

var ursaKey = ursa.createPrivateKey(serverKey);

CryptoUtils.prototype.prvKeyEncript = function(text, outEncoding, encoding) {
    if(!outEncoding)
        outEncoding = "base64";
    if(!encoding)
        encoding = "utf8";
    var encrypted = ursaKey.encrypt(text, encoding, outEncoding);
    if(outEncoding === "base64")
        encrypted = safeBase64(encrypted);
    return encrypted;
}

CryptoUtils.prototype.prvKeyDecript = function(text, inEncoding, encoding) {
    if(!inEncoding)
        inEncoding = "base64";
    if(!encoding)
        encoding = "utf8";
    if(inEncoding === "base64")
        text = unsafeBase64(text);
    return ursaKey.decrypt(text, inEncoding, encoding);
}

function safeBase64(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}
function unsafeBase64(base64) {
    var padding = "===";
    var length = base64.length + padding.length;
    base64 = (base64 + padding).slice(0, length -(length % 4));
    return base64.replace(/-/g, '+').replace(/_/g, '/');
}

function Utils() {
    return {
        actions : new ActionUtils(),
        crypto : new CryptoUtils(),
        wrap : function(obj) { return function(){ return obj; }; },
        extract : function(prop) { return function(obj){ return obj[prop]; }; },
        safeBase64: safeBase64,
        unsafeBase64: unsafeBase64
    }
}

module.exports = Utils();
