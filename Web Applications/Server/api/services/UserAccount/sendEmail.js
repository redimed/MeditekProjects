var config = sails.config.myconf;
module.exports = function(data) {
    var p = new Promise(function(a, b) {
    	var emailInfo = {
	        from    	: 'Redimed <giangvotest2511@gmail.com>',
	        email   	: data.userInfo.Email,
	        subject 	: 'Forgot Password',
	        userInfo    : data.userInfo,
	        url			: config.url
	    };
	    SendMailService.SendMail(data.template, emailInfo, function(err, responseStatus, html, text) {
	    	if(err) {
	    		b(err);
	    	}
	    	else {
	    		a('success');
	    	}
	    });
    });
    return p;
}