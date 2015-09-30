var $q = require('q');
module.exports = {

	FindByPhoneNumber:function(PhoneNumber)
	{
		return UserAccount.findAll({
			where :{
				PhoneNumber:PhoneNumber
			}
		});
	},

	CreateUserAccount:function(userInfo,transaction)
	{
		function Validate()
		{
			var q=$q.defer();
			try {
				//email validation
				var emailPattern = new RegExp(HelperService.regexPattern.email);
				// if(userInfo.Email && emailPattern.test(userInfo.Email))
				// if(userInfo.Email && emailPattern.test(userInfo.Email))
				// {
				// 	throw new Error('invalid email');
				// }
				//Phone number validation
				var fullPhoneNumberPattern= new RegExp(HelperService.regexPattern.fullPhoneNumber);
				if(userInfo.PhoneNumber && fullPhoneNumberPattern.test(userInfo.PhoneNumber))
				{
					//check autralian phone number
				}
				if(userInfo.UserName || userInfo.Email || userInfo.PhoneNumber)
				{
					q.resolve({result:'success'});
				}
				else
				{
					throw new Error('Must enter User Name or Email or Phone Number');
				}
			}
			catch(err) {			
			    q.reject({message:err.message});
			}
			return q.promise;
		}

		return Validate()
		.then(function(data){
			return UserAccount.create(userInfo,{transaction:transaction});
		},function(err){
			throw err;
		})
	}
}
