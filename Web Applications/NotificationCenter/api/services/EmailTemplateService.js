var emailTemplates = require('email-templates');
var path=require('path');
var templateDir=path.join(__dirname,'email_templates');
var $q = require('q');
module.exports={
	//return object with html and text
	Generate:function(templateName,dataBinding)
	{
		var q=$q.defer();
		try{
			emailTemplates(templateDir, function(err, template) {
	            if (err) {
	                throw err;
	            }

	            template(templateName, dataBinding, function(err, html, text) {
	                if (err) {
	                    throw err;
	                }
	                q.resolve({html:html,text:text});
	            });
	        });
		}
		catch(e)
		{
			q.reject(e);
		}
		return q.promise;
	}
}