var jwt = require('jsonwebtoken');
var secret = 'ewfn09qu43f09qfj94qf*&H#(R';
var o=require("../services/HelperService");
var ErrorWrap=require("../services/ErrorWrap");
var UserTokenService=require("../services/UserAccount/UserToken");
var jwt = require('jsonwebtoken');

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
				var userAccess={
					UserUID:req.user.UID,
					SystemType:req.headers.systemtype,
					DeviceID:req.headers.deviceid
				};
				//Lấy thông tin userToken
				UserTokenService.GetUserToken(userAccess)
				.then(function(ut){
					jwt.verify(token, ut.SecretKey, function(err, decoded) {
						//Nếu verify token có lỗi
						if(o.checkData(err))
						{
							o.exlog(err);
							//Nếu là lỗi token quá hạn
							if(err.name=='TokenExpiredError')
							{ 
								//Kiểm tra secret key có quá hạn hay chưa
								if(!o.isExpired(ut.SecretCreatedDate,ut.TokenExpired))
								{
									//Nếu secret key chưa quá hạn
									//Kiểm tra nếu system là web thì tạo token mới dựa trên secret key
									if(req.headers.systemtype==o.const.systemType.website)
									{
										var newtoken=jwt.sign(
											{UID:req.user.UID}, 
											ut.SecretKey, 
											{ expiresIn: o.const.authTokenExpired[req.headers.systemtype]}
										);
										res.set('newtoken',newtoken);
	            						res.header('Access-Control-Expose-Headers', 'newtoken');
	            						next();
									}
									else
									{
										//Nếu system type thuộc mobile thì tạo secret key mới (userToken) 
										//đồng thời tạo token mới
										UserTokenService.MakeUserToken(userAccess)
										.then(function(data){
											var newtoken=jwt.sign(
												{UID:req.user.UID}, 
												data.SecretKey, 
												{ expiresIn: o.const.authTokenExpired[req.headers.systemtype]}
											);
											res.set('newtoken',newtoken);
		            						res.header('Access-Control-Expose-Headers', 'newtoken');
		            						next();
										},function(err){
											o.exlog(err);
											error.pushError("isAuthenticated.userTokenMakeError");
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