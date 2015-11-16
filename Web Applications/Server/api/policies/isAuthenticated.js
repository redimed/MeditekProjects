
var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
var UserTokenService=require("../services/UserAccount/UserToken");
var jwt = require('jsonwebtoken');
var moment = require('moment');
/**
 * isAuthenticated: Kiểm tra user đã login hay chưa, và token của user có hợp lệ hay không
 * Input: 
 *  - req.headers: 
 * 		+authorization
 * 		+systemtype
 * 		+deviceid (nếu systemtype thuộc mobile system)
 * Output:
 * - nếu thành công --->next()
 * - nếu thất bại trả error
 * 		error.errors[0]:
 *   		+ isAuthenticated.userTokenMakeError: lỗi make (create/update) userToken
 * 			+ isAuthenticated.secretKeyExpired: secret key quá hạn
 * 			+ isAuthenticated.tokenInvalid: token quá hạn
 * 			+ isAuthenticated.authorizationFailPattern: lỗi sai định dạng authorization (Bearer ...)
 * 			+ isAuthenticated.authorizationNotProvided: header không có authorization field
 * 			+ isAuthenticated.notAuthenticated : chưa login bằng passport, hoặc session đã hết hạn
 */
module.exports = function(req, res, next) {
	var error=new Error("Policies.isAuthenticated.Error");
	//Kiểm tra xem đã login thông qua passport hay chưa
	if (req.isAuthenticated()) 
	{
		//Đã login bằng passport
		//Bước tiếp theo kiểm tra token:
		var authorization=req.headers.authorization;
		//Kiểm tra trong header có authorization hay chưa
		if(o.checkData(authorization))
		{
			//Authorization token phải bắt đầu bằng Bearer
			if(authorization.startsWith('Bearer '))
			{
				var token=authorization.slice('Bearer '.length);
				//lấy secret key từ db
				//
				var userToken={
					UserUID:req.user.UID,
					SystemType:req.headers.systemtype,
					DeviceID:req.headers.deviceid
				};

				//Lấy thông tin userToken
				var sessionUser=req.session.passport.user;

				function systemValidation()
				{
					if(sessionUser.SystemType==HelperService.const.systemType.website)
					{
						return true;
					}
					else
					{
						return (sessionUser.DeviceID==userToken.DeviceID
							&& sessionUser.SystemType==userToken.SystemType);
					}
				}

				if(!systemValidation())
				{
					error.pushError("isAuthenticated.sessionNotFound");
					return res.unauthor(ErrorWrap(error));
				}
				

				jwt.verify(token, sessionUser.SecretKey, function(err, decoded) {
					
					if(o.checkData(err))
					{
						o.exlog(err);
						//Nếu là lỗi token quá hạn
						if(err.name=='TokenExpiredError')
						{ 
							//Kiểm tra secret key có quá hạn hay chưa
							var payload=jwt.decode(token);
							if(!o.isExpired(sessionUser.SecretCreatedAt,sessionUser.SecretExpired))
							{
								Services.RefreshToken.GetRefreshToken(userToken)
								.then(function(rt){
									if(payload.RefreshCode==o.md5(rt.OldCode))
									{
										console.log("PAYLOAD WITH OLD REFRESH_CODE");
										if(moment().isBefore(moment(rt.OldCodeExpiredAt)))
										{
											next();
										}
										else
										{											
											error.pushError("isAuthenticated.oldRefreshCodeExpired");
											return res.unauthor(ErrorWrap(error));
										}
									}
									else if(payload.RefreshCode==o.md5(rt.RefreshCode))
									{
										console.log("PAYLOAD WITH CURRENT REFRESH_CODE");
										Services.RefreshToken.CreateNewRefreshCode(userToken,payload.RefreshCode)
										.then(function(refreshToken){
											if(refreshToken!==null)
											{
												res.set('requireupdatetoken',true);
												res.header('Access-Control-Expose-Headers', 'requireupdatetoken');
												// res.set('newtoken',newtoken);
												// res.header('Access-Control-Expose-Headers', 'newtoken');
												console.log(">>>>>>>>>>>>>>>AAAAAAAAAWWWWWWWWW")
												next();
											}
											else
											{
												next();
											}
										},function(err){
											return res.unauthor(ErrorWrap(err));
										})
									}
									else
									{
										error.pushError("isAuthenticated.invalidRefreshCode");
										return res.unauthor(ErrorWrap(error));
									}
								},function(err){
									o.exlog(err);
									error.pushError("isAuthenticated.refreshTokenQueryError");
									return res.unauthor(ErrorWrap(error));
								})
							}
							else
							{
								error.pushError("isAuthenticated.secretKeyExpired");
								return res.unauthor(ErrorWrap(error));
							}
						}
						else 
						{
							console.log(err);
							error.pushError("isAuthenticated.tokenInvalid");
							return res.unauthor(ErrorWrap(error));
						}
					}
					else
					{
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
