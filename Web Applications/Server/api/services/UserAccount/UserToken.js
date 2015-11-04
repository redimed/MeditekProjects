var $q = require('q');
var o=require("../HelperService");

/**
 * Validation: 
 * @param {[type]} userToken [description]
 */
function Validation(userAccess)
{
	var error=new Error("UserToken.Validation.Error");
	var q=$q.defer();
	try
	{
		var systems=[];
		var mobileSystems=[];
		systems.push(HelperService.const.systemType.website);
		systems.push(HelperService.const.systemType.ios);
		systems.push(HelperService.const.systemType.android);
		mobileSystems.push(HelperService.const.systemType.ios);
		mobileSystems.push(HelperService.const.systemType.android);

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

		if(!o.checkData(userAccess.SystemType))
		{
			error.pushError("systemType.notProvided");
			throw error;
		}
		else if(systems.indexOf(userAccess.SystemType)>=0)
		{
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
	
	MakeUserToken:function(userAccess,transaction)
	{
		console.log("=======================MakeUserToken==============================");
		var error=new Error("MakeUserToken.Error");
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
							return UserToken.findOne({
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
							})
						}
					}

					return CheckExist()
					.then(function(ut){
						if(o.checkData(ut))
						{
							return ut.updateAttributes({
								SecretKey:UUIDService.Create(),
								SecretCreatedDate:new Date(),
								TokenExpired:o.const.authSecretExprired[userAccess.SystemType],
								Enable:'Y',
							},{transaction:transaction})
							.then(function(result){
								return result;
							},function(err){
								o.exlog(err);
								error.pushError("userToken.updateError");
								throw error;
							})
						}
						else
						{
							var insertInfo={
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								SecretKey:UUIDService.Create(),
								SecretCreatedDate:new Date(),
								TokenExpired:o.const.authSecretExprired[userAccess.SystemType],
								Enable:'Y',
							};
							if(userAccess.SystemType!=HelperService.const.systemType.website)
							{
								insertInfo.DeviceID=userAccess.DeviceID;
								console.log(insertInfo);
							}

							return UserToken.create(insertInfo,{transaction:transaction})
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

	GetUserToken:function(userAccess,transaction)
	{
		var error=new Error("GetUserToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){
				function CheckExist()
				{
					if(userAccess.SystemType==HelperService.const.systemType.website)
					{
						return UserToken.findOne({
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
				.then(function(ut){
					if(o.checkData(ut))
					{
						return ut;
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
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},

	/*MakeNewSecretKey:function(userToken,transaction)
	{
		var error=new Error("MakeNewSecretKey.Error");
		return Validation(userToken)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userToken.UserUID},null,transaction)
			.then(function(user){
				function CheckExist()
				{
					if(userToken.SystemType==HelperService.const.systemType.website)
					{
						return UserToken.findOne({
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
								DeviceID:userToken.DeviceID
							}
						},{transaction:transaction})
					}
				}
				return CheckExist()
				.then(function(ut){
					if(o.checkData(ut))
					{
						return ut.updateAttributes({
							SecretKey:UUIDService.Create(),
							// SecretCreatedDate:new Date(),
							// TokenExpired:null,
							// Enable:'Y',
						},{transaction:transaction})
						.then(function(result){
							return result;
						},function(err){
							o.exlog(err);
							error.pushError("userToken.updateError");
							throw error;
						})
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
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},*/
}