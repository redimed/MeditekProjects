var moment=require('moment');
var jwt = require('jsonwebtoken');
var o=require("../../../services/HelperService");
module.exports={

	GetNewToken:function(req,res)
	{
		var refreshCode=req.body.refreshCode;
		var userToken={
			UserUID:req.user.UID,
			SystemType:req.headers.systemtype,
			DeviceID:req.headers.deviceid,
			AppID:req.headers.appid,
		};
		var error=new Error("GetNewToken.Error");
		return Services.RefreshToken.GetRefreshToken(userToken)
		.then(function(rt){
			if(o.checkData(rt))
			{
				var refreshToken=rt.dataValues;
				var payload={
					UID:req.user.UID,
					RefreshCode:o.md5(refreshToken.RefreshCode)
				};
				var token=jwt.sign(
                    payload,
                    refreshToken.SecretKey,
                    {expiresIn:o.const.authTokenExpired[req.headers.systemtype]}
                );
				var returnToken={
					// status:null,
					token:token,
					refreshCode:refreshToken.RefreshCode
				}

				return RefreshToken.update({
					Status:'GOT'
				},{
					where:{
						UserAccountID:req.user.ID,
						SystemType:req.headers.systemtype,
						DeviceID:req.headers.deviceid||null,
						AppID:req.headers.appid||null,
						OldCode:refreshCode,
						Status:'WAITGET'
					}
				})
				.then(function(result)
				{
					return res.ok(returnToken);	
				},function(err){
					console.log(err);
					error.pushError("GetNewToken.updateStatusError");
					return res.serverError(ErrorWrap(error));
				});
			}
			else
			{
				error.pushError("GetNewToken.refreshTokenNotFound");
				return res.serverError(ErrorWrap(error));
			}
		},function(err){
			return res.serverError(ErrorWrap(err));
		});
	},
}