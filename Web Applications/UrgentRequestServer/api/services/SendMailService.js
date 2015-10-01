var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
var templateDirs = path.resolve(__dirname, 'GenerateTemplateEmail');
var emailTemplates = require('email-templates');
var emailAddressRequiredError = new Error('email address required');

var transport, isTestApp = 1;
if (isTestApp === 1) {
    transport = nodemailer.createTransport(smtpTransport({
        host: "mail.redimed.com.au",
        secure: false,
        port: 25,
        auth: {
            user: "programmer2",
            pass: "Hello8080"
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    }));
} else {
    transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'timesheetnotification@gmail.com',
            pass: 'timesheet1234'
        }
    });
}

var SendMailService = {
    /*
    SendMail: Send mail notification for patient
    input: templateName - template email, emailInfo - information send mail, fn - function callback send mail
    output: status send mail
    */
    SendMail: function(templateName, emailInfo, fn) {
        if (!emailInfo.email) {
            return fn(emailAddressRequiredError);
        }

        if (!emailInfo.subject) {
            return fn(emailAddressRequiredError);
        }

        emailTemplates(templateDirs, function(err, template) {
            if (err) {
                return fn(err);
            }
            template(templateName, emailInfo, function(err, html, text) {
                if (err) {
                    return fn(err);
                }
                transport.sendMail({
                    from: emailInfo.from,
                    to: emailInfo.email,
                    subject: emailInfo.subject,
                    html: html,
                    text: text,
                    cc: emailInfo.cc
                }, function(err, responseStatus) {
                    if (err) {
                        return fn(err);
                    }
                    return fn(null, responseStatus.message, html, text);
                });
            });
        });
    }
};
module.exports = SendMailService;
