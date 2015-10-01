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
		function Validation()
		{
			var q=$q.defer();
			var mobileSystems=[];
			mobileSystems.push(HelperService.const.systemType.ios);
			mobileSystems.push(HelperService.const.systemType.android);
			try{
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
				else if(mobileSystems.indexOf(activationInfo.Type))
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
