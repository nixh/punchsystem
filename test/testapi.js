var request = require('request');
var assert = require('assert');
var path = require('path');

var baseApiPath = "localhost:11345/";

function api(url, data, headers, fn) {
    if(!fn) {
        fn = headers;
        headers = {};
    }

    if(url.indexOf('http') !== 0) {
        url = path.join(baseApiPath, url);
        url = "http://" + url;
    }
    
    request({
        method: 'POST',
        uri: url,
        headers: headers,
        form: data
    }, fn);
}

var signiture = "w6wrw6bCucKQJlzDhsONw7tUw7knBcKJCw9KbCg=";

var authKey = null;

describe('Auth Key API --- /api/auth_key', function(){

    it('should not get authkey with incorrect signiture', function(done){
        api('/api/auth_key', 
            {signiture: '12345'}, 
            function(err, res, body){
                assert(!err, "Error is:" + err);
                body = JSON.parse(body);
                assert.equal(body.status, 'fail', "Status should be fail!");
                done();
        });
    });

    it('should get authkey with correct signiture', function(done){
        api('/api/auth_key', {signiture: signiture},
            function(err, res, body){
                assert(!err, "Error is:" + err);
                body = JSON.parse(body);
                assert(body.success, "Status should be success!");
                assert(body.key, "the return key is:" + body.key);
                authKey = body.key;
                done();
        });
    });
});

describe('Login API --- /api/login', function(){

    it('should not return user info with out authKey', function(done){
        api('/api/login', {
            userName : 'ln1',
            password : '0000'
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert(body.status === 'fail', "Status should be fail");
            assert.equal(body.err, 
                         'invalid_authkey', 
                         "Error message should be invalid_authkey");
            done();
        });
    });


    it('should return user info', function(done){
        api('/api/login', {
            userName : 'ln1',
            password : '0000'
        },{
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            var user = body.data;
            assert(user, "Should return user");
            assert.equal(user.userid, 'ln1', 
                         'userid should be the same');
            done();
        });
    });
    
    it('should not return user info with wrong password', function(done){
        api('/api/login', {
            userName : 'ln1',
            password : '000'
        },{
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert(body.status === 'fail', "Status should be fail");
            done();
        });
    });

    it('should not return user info with wrong userName', function(done){
        api('/api/login', {
            userName : 'ln1000',
            password : '0000'
        },{
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert(body.status === 'fail', "Status should be fail");
            done();
        });
    });
});

var testuserid = "ln33";
//var punchkey = "9fd6c610-3d57-11e5-8ac4-f3bb072350ae.w5PDkcOVw4fDoMKwwqQwMMK2wrRracKtw5nDvcOgwpbCqmc";
var punchkey = "a9026cc0-3d4e-11e5-ba2a-63644a1ad4f8.wqtAD8ONYBtfwqjDhTcVwprCrz3DjH7DsH3CgMKX";

describe('Punch IN/OUT --- /api/punch/:punchkey', function(){

    it('should not punch in/out if punchkey is wrong', function(done){
        api('/api/punch/whateverwrongcode', {
            userid: testuserid
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            assert.equal(body.msg, 'invalid_punchkey', "Msg should be invalid_punchkey");
            done();
        });
    });

    it('should not punch in/out if user is in another company', function(done){
        api('/api/punch/'+punchkey, {
            userid: 'ln10'
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            assert.equal(body.msg, 'punchFailed', "Msg should be punchFailed");
            done();
        });
    });

    it('should punch in if it is the first time and return the data', function(done){
        api('/api/punch/'+punchkey, {
            userid: testuserid
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            var punchData = body.data;
            assert(punchData, "punchData should not be empty!");
            assert.equal(punchData.punchOut, false, "punch in should be false");
            assert(punchData.punchTime, "should have punch time.");
            done();
        });
    });

    it('should punch out if it is the second time and return the data', function(done){
        api('/api/punch/'+punchkey, {
            userid: testuserid
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            var punchData = body.data;
            assert(punchData, "punchData should not be empty!");
            assert.equal(punchData.punchOut, true, "punch in should be false");
            assert(punchData.punchTime, "should have punch time.");
            done();
        });
    });
});


describe('Change password --- /api/changepwd', function(){
    it('should not change password if the old password is wrong', function(done){
        api('/api/changepwd', { 
            userid: 'ln2',
            oldPassword: 'sadfasdf',
            newPassword: '0000'
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });

    it('should not change password if two password is the same ', function(done){
        api('/api/changepwd', { 
            userid: 'ln2',
            oldPassword: '0000',
            newPassword: '0000'
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });

    it('should change password if everything is ok', function(done){
        api('/api/changepwd', { 
            userid: 'ln2',
            oldPassword: '0000',
            newPassword: '1234'
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be fail");
            done();
        });
    });

    it('should change password back to initail', function(done){
        api('/api/changepwd', { 
            userid: 'ln2',
            oldPassword: '1234',
            newPassword: '0000'
        }, { 
            auth_key: authKey 
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be fail");
            done();
        });
    });
});

describe('Setting Emails --- /api/email_report_settings', function(){

    it('should not change settings if the arguments are missing', function(done){
        api('/api/email_report_settings', {
            email: 'saiqiuli@gmail.com, qiul@usnyfuture.com',
            isEmailReport: true,
            reportType: 1
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });

    it('should change settings', function(done){
        api('/api/email_report_settings', {
            email: 'saiqiuli@gmail.com, qiul@usnyfuture.com',
            isEmailReport: true,
            reportType: 1,
            employeeId: 'ln2'
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be success");
            done();
        });
    });
});

describe('Get User Email Settings --- /api/user_email_report_settings', function(){

    it('should not change settings if the arguments are missing', function(done){
        api('/api/user_email_report_settings', {
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });

    it('should change settings', function(done){
        api('/api/user_email_report_settings', {
            employeeId: 'ln2'
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be success");
            done();
        });
    });
    
});

describe('Get User Records --- /api/records', function(){

    it('should not get records if arguments are missing', function(done){
        api('/api/records',{
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });

    it('should get 5 records if ignore length_limit params', function(done){
        api('/api/records',{
            userid: 'ln33',
            beginDate: '2015-07-01',
            endDate: '2015-07-31'
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be succss");
            assert.equal(body.data.length, 5, "Data length should be 5");
            done();
        });
    });

    it('should get 3 records if set rec_length=3', function(done){
        api('/api/records',{
            userid: 'ln33',
            beginDate: '2015-07-01',
            endDate: '2015-07-31',
            rec_length: 3
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be success");
            assert.equal(body.data.length, 3, "Data length should be 5");
            done();
        });
    });
});

describe('Email User Details --- /api/email/detail_report', function(){

    it('should not send email if params are lacking', function(done){
        api('/api/email/detail_report',{
            beginDate: '2015-07-01',
            endDate: '2015-07-31',
            email: 'saiqiuli@gmail.com'
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            done();
        });
    });
    
    it('should send email to user', function(){
        api('/api/email/detail_report',{
            startDate: '2015-07-01',
            endDate: '2015-07-31',
            email: 'saiqiuli@gmail.com',
            userid: 'ln8'
        }, {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'success', "Status should be success");
        });
    });
});

describe('Disable authkey --- /api/disable_key', function(){

    it('should not disable authkey if key is wrong', function(done){
        api('/api/disable_key', {
            auth_key: '12345'
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert.equal(body.status, 'fail', "Status should be fail");
            assert.equal(body.msg, 'nonexists_key', "Msg should be nonexsits_key");
            done();
        });
    });

    it('should disable authkey', function(done){
        api('/api/disable_key', {
            auth_key: authKey
        }, function(err, res, body){
            assert(!err, "Error is:" + err);
            body = JSON.parse(body);
            assert(body.status === 'success', "Status should be success");
            done();
        });
    });

});

