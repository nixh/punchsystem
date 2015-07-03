var nobi = require('nobi');
var signer = nobi("god knows it");
var param = process.argv[2];
console.log(signer.sign(param));
