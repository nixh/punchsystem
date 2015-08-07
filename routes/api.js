var express = require('express');
var router = express.Router();
var Action = require('../lib/common/action');

router.post('/login', Action('login.api'));
router.post('/changepwd', Action('settings.changePwd'));
router.post('/records', Action('auth.searchRecords'));
router.post('/auth_key', Action('auth.getKey'));
router.post('/email/detail_report', Action('reports.emailDetailReportsCSV'));
router.post('/disable_key', Action('auth.disableKey'));
router.post('/punch/:punchkey', Action('auth.punch'));
router.post('/email_report_settings', Action('settings.emailSettings'));

//router.post('/email_report_settings', Action('userSettings.emailSwitch'));
//router.post('/send_email/:userid', Action('userSettings.sendEmail'));
//router.post('/qrcode', Action('settings.qrcode'));
module.exports = router;
