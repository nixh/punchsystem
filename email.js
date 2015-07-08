var stream = require('stream');
var emailjs = require('emailjs');
var config = require('./config.json');
var _ = require('underscore');
var emailConfig = config["email.server"];

function strToStream(str) {
    var readable = new stream.Readable();
    readable._read = _.noop;
    readable.push(str);
    readable.push(null);
    readable.pause();
    return readable;
}

function ServerEmailModule(conf) {

    if(conf) {
        _.extend(emailConfig, conf);
    }
    var account = emailConfig.account;
    var host = emailConfig.host;
    var password = emailConfig.password;
    var ssl = emailConfig.ssl;
    var server = emailjs.server.connect({
        user: account,
        password: password,
        host: host,
        ssl : ssl
    });

    return {
        sendEmail : function(to, cc, subject, html, csvStringForAttachments) {
            var message = {
                to: to,
                from: 'haha@example.com',
                subject: subject,
                text: 'would be replaced!'
            }
            var attachments = [];
            attachments.push({
                data: "<html>" + html + "</html>",
                alternative: true
            })
            if(_.isArray(csvStringForAttachments))
                _.each(csvStringForAttachments, function(csv){
                    attachments.push({
                        stream: strToStream(csv),
                        headers: { 'contentType': 'application/csv' },
                        name: 'report.csv'
                    });
                });
            message['attachment'] = attachments;
            server.send(message, function(err, msg){
                console.log(err||msg);
            });
        }
    }
}

//var email = ServerEmailModule();
//email.sendEmail('saiqiuli@gmail.com', '', 'new test!', 'haha i am a <i>html content</i>.', ['test,test1,test2\n1,2,3']);

module.exports = ServerEmailModule;
