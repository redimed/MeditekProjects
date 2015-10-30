
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
module.exports = function(req, res, next) {
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.");
	console.log(req.cookies.token);
	var error=new Error("Policies.isAuthenticated.Error");
	if (req.isAuthenticated()) 
	{
		//Passport Authenticated
		//Verify token:
		var authorization=req.headers.authorization;
		if(o.checkData(authorization))
		{
			if(authorization.startsWith('Bearer '))
			{
				var token=authorization.slice('Bearer '.length);
				jwt.verify(token, secret, function(err, decoded) {
					if(o.checkData(err))
					{
						console.log(err);
						error.pushError("isAuthenticated.tokenInvalid");
						return res.unauthor(ErrorWrap(error));
					}
					else
					{
						console.log(">>>>>>>>>>>>>>>>>TOKEN DECODE:");
				  		console.log(decoded);
				  		next(); 
					}
					
					
				});
			}
			else
			{
				error.pushError("isAuthenticated.authorizationFailPattern");
				return res.unauthor(ErrorWrap(error));
			}
			
		}
		else
		{
			error.pushError("isAuthenticated.authorizationNotProvided");
			return res.unauthor(ErrorWrap(error));
		}
	}
	else
	{
		error.pushError("isAuthenticated.notAuthenticated");
		return res.unauthor(ErrorWrap(error));
	}
  	
};