var btoa = require('btoa');
var request = require('request');
var string = btoa(process.argv[2]);
var url = 'http://beststudy.us/getqrcode/' + string;
request.get(url).pipe(process.stdout);
