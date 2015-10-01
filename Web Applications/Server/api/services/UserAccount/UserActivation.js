var $q = require('q');
module.exports = {
	/**
	 * Create user activation
	 * Input:
	 * 	if website system: 
	 * 		activationInfo:UserAccountID,Type,VerificationToken
	 * 	if mobile system:
	 * 		activationInfo: UserAccountID,Type, VerificationCode, DeviceID
	 * output: new UserActivation
	 */
	CreateUserActivation:function(activationInfo,transaction)
	{
		console.log(activationInfo);
		function Validation()
		{
			var q=$q.defer();
			var mobileSystems=[];
			mobileSystems.push(HelperService.const.systemType.ios);
			mobileSystems.push(HelperService.const.systemType.android);
			try{
				//Code mẫu demo trả về error với nhiều chi tiết lỗi
				if(activationInfo.VerificationCode.length>2)
				{
					var errors=[];
					var err=new Error('Validate.VerificationCode');
					// err.errors=[];
					// err.errors.push({field: 'from_date', message: 'From Date must be smaller than or equal To Date'});
					// err.errors.push({field: 'to_date', message: 'To Date must be larger than or equal From Date'});
					errors.push({field: 'from_date', message: 'From Date must be smaller than or equal To Date'});
					errors.push({field: 'to_date', message: 'To Date must be larger than or equal From Date'});
					err.pushErrors(errors);
					throw err;
					
				}
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
	}

}
