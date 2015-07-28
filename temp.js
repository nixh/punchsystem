var fs = require('fs');
var crypto = require('crypto');
var ursa = require('ursa');
var utils = require('./lib/common/utils');

var key = fs.readFileSync('./certs/serverkey.pem');
var pub = fs.readFileSync('./certs/pub.pem');

var skey = ursa.createPrivateKey(key);
var crt = ursa.createPublicKey(pub);
var text = "Hello";
var msg = crt.encrypt(text, 'utf8', 'hex')
console.log(msg);
console.log(skey.decrypt(msg, 'hex', 'utf8'));

var config = require('./lib/common/config')();

var verified = utils.crypto.verify(config.get('clientAuthSig'), "w6wrw6bCucKQJlzDhsONw7tUw7knBcKJCw9KbCg=");
console.log(verified);

