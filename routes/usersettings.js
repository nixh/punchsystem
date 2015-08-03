var express = require('express');
var router = express.Router();

var monk = require('monk');
var utils = require('../utils'); var db = monk(utils.getConfig('mongodbPath'));
var btoa = require('btoa'); var nobi = require('nobi'); var crypto = require('crypto');
var signer = nobi(utils.getConfig('appKey'));
var uuid = require('node-uuid');
var util = require('util');
var moment = require('moment');
var dbhelper = require('../db/db');
var Action = require('../lib/common/action');

router.get('/settings',Action('settings.staffSettingView'))
router.get('/supervisor/settings',Action('settings.supSettingView'))
router.get('/supervisor/sendemail',Action('settings.setEmailView'))
router.get('/supervisor/setrate',Action('settings.setRateView'))
router.post('/settings',Action('settings.changePass'))
router.post('/supervisor/settings',Action('settings.supChangePass'))
router.post('/supervisor/sendemail',Action('settings.setEmail'))
router.post('/supervisor/setrate',Action('settings.setRate'))
router.post('/enableEmail/:switchs',Action('settings.emailSwitch'))
router.post('/enablerate/:switchs',Action('settings.rateSwitch'))
router.post('/sendemail',Action('settings.sendEmail'))

module.exports = router;
