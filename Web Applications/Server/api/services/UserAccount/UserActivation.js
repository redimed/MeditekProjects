var $q = require('q');
module.exports = {
	/**
	 * Create user activation
	 * Input:
	 * 	if website system: 
	 * 		activationInfo:UserAccountID,Type,VerificationToken
	 * 	if mobile system:
	 * 		activationInfo: UserAccountID,Type, VerificationCode, DeviceID
	 * output: 
	 * 	if success return promise.resolve(user Activation Info)
	 * 	if error throw error
	 */
	CreateUserActivation:function(activationInfo,transaction)
	{

		function Validation()
		{
			var q=$q.defer();
			var mobileSystems=[];
			mobileSystems.push(HelperService.const.systemType.ios);
			mobileSystems.push(HelperService.const.systemType.android);
			try{
				//Code mẫu demo trả về error với nhiều chi tiết lỗi
				/*if(activationInfo.VerificationCode.length>2)
				{
					var errors=[];
					var err=new Error('Validate.VerificationCode');
					errors.push({field: 'from_date', message: 'From Date must be smaller than or equal To Date'});
					errors.push({field: 'to_date', message: 'To Date must be larger than or equal From Date'});
					err.pushErrors(errors);
					throw err;
					
				}*/
				//Check UserAccountId
				if(!activationInfo.UserAccountID)
				{
					throw new Error('User Account is not provided');
				}
				//Check system type
				if(!activationInfo.Type)
				{
					throw new Error('System type (IOS, Website, Android) is not provided');
				}
				else if(activationInfo.Type==HelperService.const.systemType.website)
				{
					if(!activationInfo.VerificationToken) 
					{
						throw new Error("System type is website but VerificationToken is not provided");
					}
				}
				else if(mobileSystems.indexOf(activationInfo.Type)>=0)
				{
					if(!activationInfo.VerificationCode || !activationInfo.DeviceID)
					{
						throw new Error("System type is mobile but VerificationCode and DeviceID are not provided");
					}
				}
				else
				{
					throw new Error("System type unknown");
				}
				q.resolve({result:'success'});
			}
			catch(err){
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(success){
			var insertInfo={};
			insertInfo.UserAccountID=activationInfo.UserAccountID;
			insertInfo.Type=activationInfo.Type;
			if(activationInfo.Type==HelperService.const.systemType.website)
			{
				insertInfo.VerificationToken=activationInfo.VerificationToken;
			}
			else
			{
				insertInfo.VerificationCode=activationInfo.VerificationCode;
				insertInfo.DeviceID=activationInfo.DeviceID;
			}
			return UserActivation.create(insertInfo,{transaction:transaction});
		},function(err){
			throw err;
		});
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
