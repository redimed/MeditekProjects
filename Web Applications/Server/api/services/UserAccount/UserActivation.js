var $q = require('q');
var randomstring = require("randomstring");
var o=require("../HelperService");
module.exports = {
	/**
	 * TODO
	 */
	CheckActivated:function(userInfo,transaction)
	{
		var error=new Error("UserActivation.Error");
		var whereClause={};
		if(_.isObject(userInfo) && _.isEmpty(userInfo))
		{
			if(o.checkData(userInfo.UID))
			{
				whereClause.UID=userInfo.UID;
			}
			else if(o.checkData(userInfo.UserName))
			{
				whereClause.UserName=userInfo.UserName;
			}
			else if(o.checkData(userInfo.Email))
			{
				whereClause.Email=userInfo.Email;
			}
			else if(o.checkData(userInfo.PhoneNumber)){
				whereClause.PhoneNumber=userInfo.PhoneNumber;
			}
			else
			{
				error.pushError("CheckActivated.conditionNotFound");
			}
		}
		else
		{
			error.pushError("CheckActivated.requireUserInfo");
		}
		if(error.getErrors().length>0)
		{
			throw error;
		}

		return UserAccount.findOne({
			where:whereClause
		},{transaction:transaction})
		.then(function(user){
			if(user)
			{

			}
			else
			{

			}
		},function(err){
			throw err;
		})
		.then(function(data){

		},function(err){

		})
	},

	/**
	 * Create user activation
	 * Input: activationInfo:{UserUID,Type,CreatedBy}
	 * output: 
	 * 	if success return promise.resolve (new User Activation Info)
	 * 	if error throw error
	 * 		error: 
	 * 		+message
	 * 		+errors:[
	 * 			. UserAccountID.notProvided
	 * 			. SystemType.notProvided
	 * 			. DeviceID.notProvided
	 * 			. SystemType.unknown
	 * 			. UserAccount.notFound
	 * 		]
	 */
	CreateUserActivation:function(activationInfo,transaction)
	{
		var err=new Error('CreateUserActivation.Error');
		function Validation()
		{
			var q=$q.defer();
			var systems=[];
			var mobileSystems=[];
			systems.push(HelperService.const.systemType.website);
			systems.push(HelperService.const.systemType.ios);
			systems.push(HelperService.const.systemType.android);
			mobileSystems.push(HelperService.const.systemType.ios);
			mobileSystems.push(HelperService.const.systemType.android);

			activationInfo.VerificationCode=randomstring.generate({length:6,charset:'numeric'});
			activationInfo.VerificationToken=randomstring.generate({length:150});
			try{
				if(_.isObject(activationInfo) && ! _.isEmpty(activationInfo))
				{
					//Check UserAccountId
					if(!activationInfo.UserUID)
					{
						err.pushError('UserUID.notProvided');
					}
					//Check system type
					if(!activationInfo.Type)
					{
						err.pushError('SystemType.notProvided');
					}
					else if(systems.indexOf(activationInfo.Type)>=0)
					{
						if(mobileSystems.indexOf(activationInfo.Type)>=0 && !activationInfo.DeviceID)
						{
							err.pushError('DeviceID.notProvided')
						}
					}
					else
					{
						err.pushError('SystemType.unknown');
					}
				}
				else
				{
					err.pushError("CreateUserActivation.paramsNotFound");
				}
				
				if(err.getErrors().length>0)
				{
					throw err;
				}
				else
				{
					q.resolve({result:'success'});
				}
			}
			catch(err){
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(success){
			return UserAccount.findOne({
				where:{UID:activationInfo.UserUID}
			},{transaction:transaction})
			.then(function(user){
				if(o.checkData(user))
				{
					function CheckExist()
					{
						if(activationInfo.Type==HelperService.const.systemType.website)
						{
							return UserActivation.findOne({
								where:{UserAccountID:user.ID,Type:HelperService.const.systemType.website}
							},{transaction:transaction});
						}
						else
						{
							return UserActivation.findOne({
								where:{UserAccountID:user.ID,DeviceID:activationInfo.DeviceID}
							})
						}
					}

					return CheckExist()
					.then(function(activation){
						if(o.checkData(activation))
						{
							//return userInfo.updateAttributes({Activated:"Y"},{transaction:transaction});

							return activation.updateAttributes({
								VerificationCode:activationInfo.VerificationCode,
								VerificationToken:activationInfo.VerificationToken,
							},{transaction:transaction})
							.then(function(result){
								return result;
							},function(e){
								o.exlog(e);
								err.pushError("CreateUserActivation.updateActivationError");
								throw err;
							})
						}
						else
						{
							//create moi
							var insertInfo={
								UserAccountID:user.ID,
								Type:activationInfo.Type,
								VerificationCode:activationInfo.VerificationCode,
								VerificationToken:activationInfo.VerificationToken,
								CreatedBy:activationInfo.CreatedBy?activationInfo.CreatedBy:null
							};
							if(activationInfo.Type!=HelperService.const.systemType.website)
							{
								insertInfo.DeviceID=activationInfo.DeviceID;
							}
							return UserActivation.create(insertInfo,{transaction:transaction})
							.then(function(result){
								return result;
							},function(e){
								o.exlog(e);
								err.pushError("CreateUserActivation.userActivationInsertError");
								throw err;
							})
							
						}
					},function(e){
						o.exlog(e);
						err.pushError("CreateUserActivation.checkExistQueryError");
						throw err;
					})
					
				}
				else
				{
					err.pushError("CreateUserActivation.userNotFound");
					throw err;
				}
			},function(e){
				o.exlog(e);
				err.pushError("CreateUserActivation.userQueryError")
				throw err;
			})

		},function(e){
			throw e;
		})

	},

	Activation:function(activationInfo,transaction){
		var UserUID=activationInfo.UserUID;
		var SystemType=activationInfo.SystemType;
		var VerificationCode=null;
		var VerificationToken=null;
		var DeviceID=null;
		var error=new Error("Activation.Error");
		return UserAccount.findOne({
			where:{UID:UserUID}
		},{transaction:transaction})
		.then(function(user){
			if(o.checkData(user))
			{
				function GetUserActivation()
				{
					if(SystemType==o.const.systemType.website)
					{
						VerificationToken=activationInfo.VerificationToken;
						return UserActivation.findOne({
							where:{UserAccountID:user.ID,Type:o.const.systemType.website}
						},{transaction:transaction})
					}
					else
					{
						VerificationCode=activationInfo.VerificationCode;
						DeviceID=activationInfo.DeviceID;
						return UserActivation.findOne({
							where:{UserAccountID:user.ID,DeviceID:DeviceID}
						})
					}
				}
				return GetUserActivation()
				.then(function(activation){
					if(SystemType==o.const.systemType.website)
					{
						if(activation.VerificationToken==VerificationToken)
						{
							return true;
						}
						else
						{
							return false;
						}
					}
					else
					{
						if(activation.VerificationCode==VerificationCode)
						{
							return true;
						}
						else
						{
							return false;
						}
					}
				},function(err){
					o.exlog(err);
					error.pushError("Activation.getUserActivationQueryError");
					throw error;
				})
			}	
			else
			{
				error.pushError("Activation.userNotFound");
				throw error;
			}
			
		},function(err){
			o.exlog(err);
			error.pushError("Activation.userQueryError");
			throw error;
		})
		

	},

	/**
	 * ActivationWeb: Activation User through g
	 * Input:
	 * 	activationInfo: useruid, verificationToken
	 * 	output: 
	 * 		if success return promise.resolve(user Info) 
	 * 		if error throw error
	 */
	ActivationWeb:function(activationInfo,transaction)
	{
		var useruid=activationInfo.useruid;
		var verificationToken=activationInfo.verificationToken;
		var userInfo={};
		//Check user exist or not
		return UserAccount.findOne({
			where:{UID:useruid}
		},{transaction:transaction})
		.then(function(user){
			if(user)
			{
				userInfo=user;
				//check userActivation exist or not
				return UserActivation.findOne({
						where:{
							UserAccountID:userInfo.ID,
							VerificationToken:verificationToken
						}},{transaction:transaction});
			}
			else
			{
				var err=new Error("User not found");
				throw err;
			}
		},function(err){
			throw err;
		})
		.then(function(userActivation){
			if(userActivation)
			{
				//Update user activative attribute
				return userInfo.updateAttributes({Activated:"Y"},{transaction:transaction});
			}	
			else
			{
				var err=new Error('User Activation info not exist');
				throw err;
			}
		},function(err){
			throw err;
		})
	},

	/**
	 * DeactivationUserAccount (for admin role) 
	 * deactivation thông qua các tiêu chí ID, UID , UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ bị deactivation
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	DeactivationUserAccount:function(criteria,transaction)
	{
		var whereClause={};
		if(criteria.ID)
			whereClause.ID=criteria.ID;
		else if(criteria.UID)
			whereClause.UID=criteria.UID;
		else if(criteria.UserName)
			whereClause.UserName=criteria.UserName;
		else if(criteria.Email)
			whereClause.Email=criteria.Email;
		else if(criteria.PhoneNumber)
			whereClause.PhoneNumber=criteria.PhoneNumber;
		else
		{
			var err=new Error('DeactivationUserAccount.Error');
			err.pushError('DeactivationUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Activated:'N'},{
			where:whereClause
		},{transaction:transaction});
	},

	/**
	 * ActivationUserAccount (for admin role)
	 * activation thông qua các tiêu chí ID, UID, UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ được activation
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	ActivationUserAccount:function(criteria,transaction)
	{
		var whereClause={};
		if(criteria.ID)
			whereClause.ID=criteria.ID;
		else if(criteria.UID)
			whereClause.UID=criteria.UID;
		else if(criteria.UserName)
			whereClause.UserName=criteria.UserName;
		else if(criteria.Email)
			whereClause.Email=criteria.Email;
		else if(criteria.PhoneNumber)
			whereClause.PhoneNumber=criteria.PhoneNumber;
		else
		{
			var err=new Error('ActivationUserAccount.Error');
			err.pushError('ActivationUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Activated:'Y'},{
			where:whereClause
		},{transaction:transaction});
	}

}
