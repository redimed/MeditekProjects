module.exports={
	'UserAccount/v0_1/UserAccountController':{
	    'Test':['hasToken','isActivated','isAdmin'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':'hasToken',
	    'UpdateUserAccount':'hasToken'
  	},

  	'UserAccount/v0_1/UserActivationController':{
	    'CreateUserActivation':['hasToken','checkVersion'],
  	},
}