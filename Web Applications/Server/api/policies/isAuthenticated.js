
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
				//Lấy thông tin session
				var sessionUser=req.session.passport.user;
				//Thông tin access
				var userAccess={
					UserUID:req.user.UID,
					SystemType:req.headers.systemtype,
					DeviceID:req.headers.deviceid,
					AppID:req.headers.appid,
				};
				function systemValidation()
				{
					if(sessionUser.SystemType==HelperService.const.systemType.website)
					{
						return true;
					}
					else
					{
						return (sessionUser.DeviceID==userAccess.DeviceID
							&& sessionUser.SystemType==userAccess.SystemType
							&& sessionUser.AppID==userAccess.AppID);
					}
				}

				if(!systemValidation())
				{
					error.pushError("isAuthenticated.sessionUserMismatchedUserAccess");
					return res.unauthor(ErrorWrap(error));
				}

				if(o.checkData(sessionUser.SecretExpiredPlusAt))
				{
					if(moment().isAfter(moment(sessionUser.SecretExpiredPlusAt)))
					{
						error.pushError("isAuthenticated.secretExpiredPlusAt");
						return res.unauthor(ErrorWrap(error));
					}
				}

				jwt.verify(token, sessionUser.SecretKey, function(err, decoded) {

					function extendSecretExpired()
					{
						//Gia hạn SECRET KEY
						if(o.checkData(sessionUser.SecretExpiredPlusAt))
						{
							// var temp=moment(sessionUser.SecretCreatedDate)
							// 		.add(o.const.authTokenExpired[req.headers.systemtype],'seconds');
							// if(temp.isBefore(moment(sessionUser.MaxExpiredDate)))
							// {
							// 	sessionUser.SecretCreatedDate=new Date();
							// }
							var current=moment();
							if(current.isBefore(moment(sessionUser.SecretExpiredPlusAt)))
							{
								sessionUser.SecretCreatedAt=new Date();
							}							
							console.log("====================Extend Secret Expire");
							console.log(sessionUser);
							console.log("====================Extend Secret Expire");
						}
					}


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
								Services.RefreshToken.GetRefreshToken(userAccess)
								.then(function(rt){
									if(payload.RefreshCode==o.md5(rt.OldCode))
									{
										console.log("PAYLOAD WITH OLD REFRESH_CODE");
										console.log(moment().format("DD/MM/YYYY HH:mm:ss"));
										console.log(moment(rt.OldCodeExpiredAt).format("DD/MM/YYYY HH:mm:ss"));
										if(moment().isBefore(moment(rt.OldCodeExpiredAt)))
										{
											extendSecretExpired();
											next();
										}
										else
										{		
											//Nếu trường hợp đang gửi request new token mà bị cúp điện
											//hoặc bị ngắt internet thì sau đó vẫn cho phép request
											//yêu cầu new token được chạy
											if(req.path==o.const.refreshCodePath 
												&& rt.status==o.const.refreshTokenStatus.waitget)
											{
												extendSecretExpired();
												next();
											}
											else
											{
												error.pushError("isAuthenticated.oldRefreshCodeExpired");
												return res.unauthor(ErrorWrap(error));
											}								
										}
									}
									else if(payload.RefreshCode==o.md5(rt.RefreshCode))
									{
										console.log("PAYLOAD WITH CURRENT REFRESH_CODE");
										Services.RefreshToken.CreateNewRefreshCode(userAccess,payload.RefreshCode)
										.then(function(result){
											if(result.status=='created')
											{
												res.set('requireupdatetoken',true);
												res.header('Access-Control-Expose-Headers', 'requireupdatetoken');
												// res.set('newtoken',newtoken);
												// res.header('Access-Control-Expose-Headers', 'newtoken');
												extendSecretExpired();
												next();
											}
											else
											{
												extendSecretExpired();
												next();
											}
										},function(err){
											return res.unauthor(ErrorWrap(err));
										})
									}
									else
									{
										console.log("PAYLOAD WITH INVALID REFRESH_CODE");
										console.log(payload);
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
						extendSecretExpired();
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
