var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path');
var templateDirs = path.resolve(__dirname, 'GenerateTemplateEmail');
var emailTemplates = require('email-templates');
var emailAddressRequiredError = new Error('email address required');
var transport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'timesheetnotification@gmail.com',
		pass: 'timesheet1234'
	}
});
var SendMailService = {
	/*
	SendMail: Send mail notification for patient
	input: templateName - template email, locals - information send mail, fn - function callback send mail
	output: status send mail
	*/
	SendMail: function(templateName, locals, fn){
		if(!locals.email){
			return fn(emailAddressRequiredError);
		}

		if(!locals.subject){
			return fn(emailAddressRequiredError);
		}

		emailTemplates(templateDirs, function(err, template){
			if(err) {
				return fn(err);
			}
			template(templateName, locals, function(err, html, text){
				if(err){
					return fn(err);
				}
				transport.sendMail({
					from: locals.from,
					to: locals.email,
					subject: locals.subject,
					html: html,
					text: text
				}, function(err, responseStatus){
					if(err){
						return fn(err);
					}
					return fn(null, responseStatus.message, html, text);
				});
			});
		});
	}
};
module.exports = SendMailService;