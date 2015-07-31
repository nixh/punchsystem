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

router.get('/settings',Action('Settings.staffSettingView'))
router.get('/supervisor/settings',Action('Settings.supSettingView'))
router.get('/supervisor/sendemail',Action('Settings.setEmailView'))
router.get('/supervisor/setrate',Action('Settings.setRateView'))
router.post('/settings',Action('Settings.changePass'))
router.post('/supervisor/settings',Action('Settings.supChangePass'))
router.post('/supervisor/sendemail',Action('Settings.setEmail'))
router.post('/supervisor/setrate',Action('Settings.setRate'))
router.post('/enableEmail/:switchs',Action('Settings.emailSwitch'))
router.post('/enablerate/:switchs',Action('Settings.rateSwitch'))
router.post('/sendemail',Action('Settings.sendEmail'))

module.exports = router;
