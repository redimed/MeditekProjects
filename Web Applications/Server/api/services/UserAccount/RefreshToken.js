var $q = require('q');
var o=require("../HelperService");
var moment=require("moment");
/**
 * Validation: 
 * Kiểm tra thông tin user request
 * - User nếu login bằng web thì không cần deviceid
 * - User nếu login bằng device thì cần deviceid
 * Input:
 * 	- userAccess: thông tin user truy cập
 * 		+UserUID
 * 		+SystemType
 * 		+DeviceID (bắt buộc nếu systemtype thuộc mobile system)
 * Output:
 *  - Nếu hợp lệ trả về {status:'success'};
 *  - Nếu không hợp lệ quăng về error;
 */
function Validation(userAccess)
{
	var error=new Error("RefreshToken.Validation.Error");
	var q=$q.defer();
	try
	{
		var systems=o.getSystems();
		var mobileSystems=o.getMobileSystems();

		//kiểm tra thông tin user request có được cung cấp hay không
		if(!_.isObject(userAccess) || _.isEmpty(userAccess))
		{
			error.pushError("params.notProvided");
			throw error;
		}

		if(!o.checkData(userAccess.UserUID))
		{
			error.pushError("userUID.notProvided");
			throw error;
		}

		//Kiểm tra systemType có được cung cấp hay không,
		//Nếu được cung cấp thì kiểm tra có hợp lệ hay không
		if(!o.checkData(userAccess.SystemType))
		{
			error.pushError("systemType.notProvided");
			throw error;
		}
		else if(systems.indexOf(userAccess.SystemType)>=0)
		{
			//Kiểm tra nếu là mobile system thì cần có deviceId
			if(mobileSystems.indexOf(userAccess.SystemType)>=0 && !userAccess.DeviceID)
			{
				error.pushError('deviceId.notProvided');
				throw error;
			}
		}
		else
		{
			error.pushError("systemType.unknown");
			throw error;
		}
		q.resolve({status:'success'});
	}
	catch(err)
	{
		q.reject(err);
	}
	return q.promise;
};


module.exports={
	
	/**
	 * [MakeUserToken description]
	 * Nếu userAccess chưa có userToken thì tạo userToken
	 * Nếu userAccess đã có userToken thì update userToken
	 * 		Các thông tin sẽ được update: SecretKey,SecretCreatedDate,TokenExpired
	 */
	MakeRefreshToken:function(userAccess,transaction)
	{
		console.log("=======================MakeUserToken==============================");
		var error=new Error("MakeRefreshToken.Error");
		return Validation(userAccess)
		.then(function(data){
			
			return UserAccount.findOne({
				where:{UID:userAccess.UserUID,Enable:'Y'},
				include: {
		            model: RelUserRole,
		            attributes: ['ID', 'UserAccountId', 'RoleId'],
		            include: {
		                model: Role,
		                attributes: ['ID', 'UID', 'RoleCode', 'RoleName']
		            }
		        }
			},{transaction:transaction})
			// return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(u){
				var user=u.dataValues;
				var listRoles = [];
        		_.each(user.RelUserRoles, function(item) {
		            listRoles.push(item.Role.dataValues);
		        });
        		user.roles=listRoles;
				if(o.checkData(user))
				{
					//Truy vấn userToken (để xem có tồn tại hay chưa)
					function CheckExist()
					{
						if(userAccess.SystemType==HelperService.const.systemType.website)
						{
							return RefreshToken.findOne({
								where:{
									UserAccountID:user.ID,
									SystemType:HelperService.const.systemType.website
								}
							},{transaction:transaction});
						}
						else
						{
							return UserToken.findOne({
								where:{
									UserAccountID:user.ID,
									DeviceID:userAccess.DeviceID
								}
							},{transaction:transaction})
						}
					}

					return CheckExist()	
					.then(function(rt){

						if(o.checkData(rt))
						{
							return rt.updateAttributes({
									OldCode:null,
									OldCodeExpiredAt:null,
									RefreshCode:UUIDService.Create(),
									Status:'GOT',
									SecretKey:UUIDService.Create(),
									SecretCreatedAt:new Date(),
									SecretExpired:100,
								},{transaction:transaction})
								.then(function(result){
									return result;
								},function(err){
									o.exlog(err);
									error.pushError("refreshToken.updateError");
									throw error;
								})
						}
						else
						{
							console.log("=========================create user token");
							//Nếu userToken chưa tồn tại thì tạo mới userToken:
							var insertInfo={
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								OldCode:null,
								OldCodeExpiredAt:null,
								RefreshCode:UUIDService.Create(),
								Status:'GOT',
								SecretKey:UUIDService.Create(),
								SecretCreatedAt:new Date(),
								SecretExpired:100,
							};
							//Nếu system type là mobile thì yêu cầu cần có DeviceID
							if(userAccess.SystemType!=HelperService.const.systemType.website)
							{
								insertInfo.DeviceID=userAccess.DeviceID;
							}

							return RefreshToken.create(insertInfo,{transaction:transaction})
							.then(function(result){
								return result;
							},function(err){
								o.exlog(err);
								error.pushError("userToken.insertError");
								throw error;
							})
						}
					},function(err){
						o.exlog(err);
						error.pushError("userToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
		},function(err){
			throw err;
		});
	},

	/**
	 * [GetUserToken description]
	 * Lấy thông tin UserToken
	 */
	GetRefreshToken:function(userAccess,transaction)
	{
		var error=new Error("GetRefreshToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){

				if(o.checkData(user))
				{
					function CheckExist()
					{
						if(userAccess.SystemType==HelperService.const.systemType.website)
						{
							return RefreshToken.findOne({
								where:{
									UserAccountID:user.ID,
									SystemType:HelperService.const.systemType.website
								}
							},{transaction:transaction});
						}
						else
						{
							return RefreshToken.findOne({
								where:{
									UserAccountID:user.ID,
									DeviceID:userAccess.DeviceID
								}
							},{transaction:transaction})
						}
					}
					return CheckExist()
					.then(function(rt){
						if(o.checkData(rt))
						{
							return rt;
						}
						else
						{
							error.pushError("userToken.notFound");
							throw error;
						}
					},function(err){
						o.exlog(err);
						error.pushError("userToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
				
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},

	CreateNewRefreshCode:function(userAccess,payloadRefreshCode,transaction)
	{
		var error=new Error("GetRefreshToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){

				if(o.checkData(user))
				{
					function CheckExist()
					{
						if(userAccess.SystemType==HelperService.const.systemType.website)
						{
							return RefreshToken.findOne({
								where:{
									UserAccountID:user.ID,
									SystemType:HelperService.const.systemType.website
								}
							},{transaction:transaction});
						}
						else
						{
							return RefreshToken.findOne({
								where:{
									UserAccountID:user.ID,
									DeviceID:userAccess.DeviceID
								}
							},{transaction:transaction})
						}
					}
					return CheckExist()
					.then(function(rt){
						var currentRefreshToken=rt.dataValues;
						if(o.checkData(rt))
						{
							if(currentRefreshToken.OldCode==payloadRefreshCode)
							{
								if(moment().isBefore(moment(currentRefreshToken.OldCodeExpiredAt)))
								{
									return null;
								}
								else
								{											
									error.pushError("CreateNewRefreshCode.oldRefreshCodeExpired");
									throw error;
								}
								//return rt;
							}
							else
							{
								return rt.updateAttributes({
									OldCode:currentRefreshToken.RefreshCode,
									OldCodeExpiredAt:moment().add(20,'seconds').toDate(),
									RefreshCode:UUIDService.Create(),
									Status:'WAITGET',
								},{transaction:transaction})
								.then(function(result){
									return result;
								},function(err){
									o.exlog(err);
									error.pushError("refreshToken.updateError");
									throw error;
								})
							}							
						}
						else
						{
							error.pushError("userToken.notFound");
							throw error;
						}
					},function(err){
						o.exlog(err);
						error.pushError("userToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
				
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},

	
}