var $q = require('q');
module.exports = {
	CreateUserActivation:function(activationInfo)
	{
		function Validation()
		{
			var q=$q.defer();
			try{
				if(!ctivationInfo.UserAccountID)
				{
					throw new Error('User Account is not provided');
				}
				if(!activationInfo.Type)
				{
					throw new Error('System type (IOS, Website, Android) is not provided');
				}
				q.resolve({result:'success'});
			}
			catch(err){
				q.reject(err);
			}
			return q.promise;
		}

		// var mobileSystems=[];
		// 			mobileSystems.push(HelperService.const.systemType.ios);
		// 			mobileSystems.push(HelperService.const.systemType.android);
		// 			if(activationInfo.Type==HelperService.const.systemType.website)
		// 			{
						
		// 			}
		// 			else if(mobileSystems.indexOf(activationInfo.Type))
		// 			{

		// 			}
		
		
		HelperService.checkData(activationInfo)
	}

}
