var $q = require('q');
var randomstring = require("randomstring");
module.exports = {
	/**
	 * Create user activation
	 * Input: activationInfo:{UserAccountID,Type,VerificationCode,CreatedBy}
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
			
			try{
				//Check UserAccountId
				if(!activationInfo.UserAccountID)
				{
					err.pushError('UserAccountID.notProvided');
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
			return UserAccount.findOne({where:{ID:activationInfo.UserAccountID}},{transaction:transaction});
		},function(err){
			throw err;
		})
		.then(function(user){
			if(user)
			{
				var insertInfo={
					UserAccountID:activationInfo.UserAccountID,
					Type:activationInfo.Type,
					VerificationCode:activationInfo.VerificationCode,
					CreatedBy:activationInfo.CreatedBy?activationInfo.CreatedBy:null
				};
				if(activationInfo.Type!=HelperService.const.systemType.website)
				{
					insertInfo.DeviceID=activationInfo.DeviceID;
				}
				return UserActivation.create(insertInfo,{transaction:transaction});
			}
			else
			{
				err.pushError('UserAccount.notFound');
				throw err;
			}
			
		},function(err){
			throw err;
		})
	},

	/**
	 * ActivationWeb: Activation User through Web
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
