var $q = require('q');
var regexp = require('node-regexp');
var generatePassword = require("password-generator");
module.exports = {

	FindByPhoneNumber:function(PhoneNumber,attributes)
	{
		// console.log(attributes)
		return UserAccount.findAll({
			where :{
				PhoneNumber:PhoneNumber
			},
			attributes:attributes
		});
	},

	/**
	 * CreateUserAccount: create user account
	 */
	CreateUserAccount:function(userInfo,transaction)
	{
		userInfo.UID=UUIDService.Create();
		function Validate()
		{
			var q=$q.defer();
			try {
				//email validation
				var emailPattern = new RegExp(HelperService.regexPattern.email);
				// if(userInfo.Email && emailPattern.test(userInfo.Email))
				if(userInfo.Email && !emailPattern.test(userInfo.Email))
				{
					throw new Error('invalid email');
				}
				//Phone number validation
				//autralian phone number regex
				var auPhoneNumberPattern=new RegExp(HelperService.regexPattern.auPhoneNumber);
				//remove (,),whitespace,- from phone number
				userInfo.PhoneNumber=userInfo.PhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(userInfo.PhoneNumber && !auPhoneNumberPattern.test(userInfo.PhoneNumber))
				{
					throw new Error('invalid phone number');
				}
				//UserName or Email or PhoneNumber must not null
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
			    q.reject(err);
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
