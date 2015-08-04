
var _ = require('underscore');
var util = require('util');
var dbm = require('../common/db');
var utils = require('../common/utils');
var config = require('../common/config');
var Q = require('q');
var wrap =utils.wrap;
var factory = require('./moduleFactory')();
var m = factory.get('sessionModule');
var email = require('../../email');
var e = new email;
var periodemail = require('../../sendemail');
var p = new periodemail();
dbm.setUrl('localhost/punchsystem');
function show(obj) {
    console.log(obj);
    return Q(obj);
}

function sha(str) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(str);
    return sha256.digest('hex');
}

function sendemail(cc, subject, html, csvStringForAttachments) {
    return function(user) {
        return e.sendEmail(user.email,cc, subject, html, csvStringForAttachments).call(this);
    }
}
function sendEmailPeriod(cc, subject, html, csvStringForAttachments) {
    return function(user) {
        return p.sendreport(user.freqz,user.email,cc, subject, html, csvStringForAttachments).call(this);
    }
}
function changePwd(oldpass,newpass) {
    return function (user) {
        return dbm.updateOne('users', {
            'userid':user.userid,
               'password':oldpass
        }, {
            '$set': {
                'password':newpass
            }
        }).call(this);
    }       
}


function getUser(userid) {
    return dbm.load('users',
            userid,
            'userid'
            ).call(this);
}

function receiveEmail(user) {
    return dbm.load('users', 
            user.userid,
            'userid'
            ).call(this);
}

function updateemail(timePeriod,receiveEmails,enableEmail) {
    return function (user) {
        return dbm.updateOne('users', {
            'userid':user.userid}, {
                "$set": {
                    'freqz':timePeriod,
               'email':receiveEmails,
               'enableEmail':enableEmail
                }
            }).call(this);
    }
}

function changeRate(newRate,overTime,enableRate){
    return function (user) {
        return dbm.updateOne('users', {
            'userid':user.userid}, {
               '$set': {
                   'curRate':newRate,
                   'overtime':overTime,
                   'enablerate':enableRate
                }
            }).call(this);
    } 
}

function onoffEmail(enableEmail) {
    return function (user) {
        return dbm.updateOne('users', {
            'userid':user.userid
        }, {
            '$set': {
                'enableEmail':enableEmail
            }
        }).call(this);
    }
}

function onoffRate(enableRate) {
    return function (user) {
        return dbm.updateOne('users', {
            'userid':user.userid
        }, {
            '$set': {
                'enablerate':enableRate
            }
        }).call(this);
    }
}

//更改密码
function settings(oldpass,newpass,sessionid) {
    return dbm.use(m.getUserBySessionId(sessionid),changePwd(oldpass,newpass));     
}

function settingsById(oldpass,newpass,userid) {
    return dbm.use(wrap(userid),getUser,changePwd(oldpass,newpass));        
}
//更改邮箱
function settingEmail(timePeriod,receiveEmails,sessionid,enableEmail) {
    return dbm.use(m.getUserBySessionId(sessionid),updateemail(timePeriod,receiveEmails,enableEmail));
}

//显示当前邮箱
function showEmail(sessionid) {
    return dbm.use(m.getUserBySessionId(sessionid),receiveEmail);
}

//立即发送邮件
function sendEmailNow(userid,cc, subject, html, csvStringForAttachments) {
    return dbm.use(wrap(userid),getUser,sendemail(cc, subject, html, csvStringForAttachments));
}

//周期发送邮件
function sendReport(userid,cc, subject, html, csvStringForAttachments) {
    return dbm.use(wrap(userid),getUser,sendEmailPeriod(cc, subject, html, csvStringForAttachments));
}
//邮箱开关
function enableEmail(sessionid,enableEmail) {
    return dbm.use(m.getUserBySessionId(sessionid),onoffEmail(enableEmail));
}

function enableEmailById(userid,enableEmail) {
    return dbm.use(wrap(userid),getUser,onoffEmail);
}

//工资开关
function enableRate(sessionid,enableRate) {
    return dbm.use(m.getUserBySessionId(sessionid),onoffRate(enableRate));
}
//工资更改
function setRate(sessionid,newRate,overTime,enableRate) {
    return dbm.use(m.getUserBySessionId(sessionid),changeRate(newRate,overTime,enableRate));
}

function Module() {

}

Module.prototype = {
    changepass : settings,
    settingEmail:settingEmail,
    showEmail:showEmail,
    enableEmail:enableEmail,
    enableRate:enableRate,
    setRate:setRate,
    sendEmail: sendEmailNow,
    sendReport: sendReport,
    enableEmailById:enableEmailById,
    changepassById: settingsById
}

module.exports = Module ;

// var s = new Module();
// // var email = require('../../email');
// // s = new email();
// s.sendEmail("LoginName_5",
//      " ","abc","haha i am a <i>html content</i>. ",
//      ["name, punchintime, punchouttime\nQ,2015-10-10 08:00:00, 2015-10-10 19:00:00"]
//      ).then(function(doc){
//              console.log(doc)
//      }) 
// Module = new Module();
