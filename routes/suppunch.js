var express = require('express');
var router = express.Router();
var utils = require('../utils');
var nobi = require('nobi');
var signer = nobi(utils.getConfig('appKey'));
var reportModule = require('../reportModule');
router.get('/suppunch/:userid/:key', function(req, res, next){
    
    var params = req.params;
    var signiture = prams.userid + "." + params.key;
    var userid = signer.unsign(signiture);

});

module.exports = router;
