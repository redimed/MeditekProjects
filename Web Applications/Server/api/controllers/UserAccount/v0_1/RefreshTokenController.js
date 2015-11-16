var moment=require('moment');
var jwt = require('jsonwebtoken');
var o=require("../../../services/HelperService");
var md5 = require('md5');
module.exports={
	GetNewToken:function(req,res)
	{
		var refreshCode=req.body.refreshCode;
		var userToken={
			UserUID:req.user.UID,
			SystemType:req.headers.systemtype,
			DeviceID:req.headers.deviceid
		};
		var error=new Error("GetNewToken.Error");
		return RefreshToken.update({
			Status:'GOT'
		},{
			where:{
				UserAccountID:req.user.ID,
				SystemType:req.headers.systemtype,
				DeviceID:req.headers.deviceid||null,
				Status:'WAITGET'
			}
		})
		.then(function(result)
		{
			if(result[0]>0)
			{
				return Services.RefreshToken.GetRefreshToken(userToken)
				.then(function(rt){
					if(rt)
					{
						var payload={
							UID:req.user.UID,
							RefreshCode:md5(rt.RefreshCode)
						};
						var token=jwt.sign(
		                    payload,
		                    rt.SecretKey,
		                    {expiresIn:15}
		                );
						var returnToken={
							token:token,
							refreshCode:rt.RefreshCode
						}
						return res.ok(returnToken);					
					}
					else
					{
						error.pushError("GetNewToken.refreshTokenNotFound");
						return res.serverError(ErrorWrap(error));
					}
				},function(err){
					return res.serverError(ErrorWrap(err));
				})
			}
			else
			{
				return res.ok('GOT');
			}
		},function(err){
			console.log(err);
			error.pushError("GetNewToken.updateStatusError");
			return res.serverError(ErrorWrap(error));
		});
	}
}