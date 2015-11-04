
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
var UserTokenService=require("../services/UserAccount/UserToken");
var jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
	var error=new Error("Policies.isAuthenticated.Error");
	if (req.isAuthenticated()) 
	{
		// return next();
		//Passport Authenticated
		//Verify token:
		var authorization=req.headers.authorization;
		if(o.checkData(authorization))
		{
			if(authorization.startsWith('Bearer '))
			{
				var token=authorization.slice('Bearer '.length);
				//lấy secret key từ db
				var userToken={
					UserUID:req.user.UID,
					SystemType:req.headers.systemtype,
					DeviceID:req.headers.deviceid
				};
				UserTokenService.GetUserToken(userToken)
				.then(function(ut){
					jwt.verify(token, ut.SecretKey, function(err, decoded) {
						if(o.checkData(err))
						{
							o.exlog(err);
							if(err.name=='TokenExpiredError')
							{ 
								if(!o.isExpired(ut.SecretCreatedDate,ut.TokenExpired))
								{
									//error.pushError("isAuthenticated.tokenExpiredError");
									if(req.headers.systemtype==o.const.systemType.website)
									{
										var newtoken=jwt.sign(req.user, ut.SecretKey, { expiresIn: o.const.authTokenExpired[req.headers.systemtype] });
										res.set('newtoken',newtoken);
	            						res.header('Access-Control-Expose-Headers', 'newtoken');
	            						next();
									}
									else
									{
										UserTokenService.MakeUserToken(userToken)
										.then(function(data){
											var newtoken=jwt.sign(req.user, data.SecretKey, { expiresIn: o.const.authTokenExpired[req.headers.systemtype] });
											res.set('newtoken',newtoken);
		            						res.header('Access-Control-Expose-Headers', 'newtoken');
		            						next();
										},function(err){
											o.exlog(err);
											error.pushError("isAuthenticated.userTokenMakeSecretKeyError");
											return res.unauthor(ErrorWrap(error));
										})
									}
								}
								else
								{
									error.pushError("isAuthenticated.secretKeyExpired");
									return res.unauthor(ErrorWrap(error));
								}
							}
							else 
							{
								error.pushError("isAuthenticated.tokenInvalid");
								return res.unauthor(ErrorWrap(error));
							}
							// console.log(err.name);
							// res.unauthor(ErrorWrap(err));
						}
						else
						{
					  		next(); 
						}
					});
				},function(err){
					return res.unauthor(ErrorWrap(err));
				})
				
				
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