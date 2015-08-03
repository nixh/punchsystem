var express = require('express');
var router = express.Router();
var Action = require('../lib/common/action');

router.post('/login', Action('login.api'));
router.post('/changepwd', Action('userSettings.changePass'));
router.post('/email_report_settings', Action('userSettings.emailSwitch'));
router.post('/send_email/:userid', Action('userSettings.sendEmail'));
router.post('/records', Action('login.api'));
router.post('/auth_key', Action('auth.getKey'));
router.post('/disable_key', Action('auth.disableKey'));
router.post('/punch/:punchkey', Action('auth.punch'));

module.exports = router;
