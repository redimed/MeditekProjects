var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var $q=require("q");

var isTest=1;
var transporter=null;
if(isTest)
{
	transporter=nodemailer.createTransport({
		service:'Gmail',
		auth:{
			user:'meditek.hcm@gmail.com',
			pass:'meditek123'
		},
		tls: {
            rejectUnauthorized: false
        }
	})
}
else
{
	transporter = nodemailer.createTransport(smtpTransport({
        host: "mail.redimed.com.au",
        secure: false,
        port: 25,
        auth: {
            user: "redicolegal",
            pass: "L3g@lSyst3m!"
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    }));
}


module.exports={
	SendMail:function(templateName,mailOptions,callback)
	{
		var q=$q.defer();
		try{
			if(!mailOptions.to)
			{
				var error=new Error("receiver.require");
				throw error;
			}

			if(!mailOptions.subject)
			{
				var error=new Error("emailSubject.require");;
				throw error;
			}

			transporter.sendMail({
	            from: mailOptions.from?mailOptions.from:null,
	            to: mailOptions.to,
	            subject: mailOptions.subject?mailOptions.subject:null,
	            html: mailOptions.html,
	            text: mailOptions.text
	        }, function(err, info) {
	            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",err);
	            if (err) {
	                q.reject(err);
	            }
	            q.resolve(info);
	        });
		}
		catch(e){
			q.reject(e);
		}
		return q.promise;
	}
}



