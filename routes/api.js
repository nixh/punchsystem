var express = require('express');
var router = express.Router();
var Action = require('../lib/common/action');

router.post('/login', Action('login.api'));
router.post('/punch/:punchkey', Action('punch.api'));
router.post('/changepwd', Action(''));
router.post('/email_report_settings', Action(''));
router.post('/records', Action(''));
router.post('/auth_key', Action(''));
router.post('/disable_key', Action(''));


module.exports = router;
