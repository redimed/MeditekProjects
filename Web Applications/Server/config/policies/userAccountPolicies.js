module.exports={
	'UserAccount/v0_1/UserAccountController':{
      // 'Test':['checkCookieToken'],
	    'Test':['hasToken'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['hasToken','isAuthenticated'],
	    'DisableUserAccount':['hasToken','isAdmin'],
	    'EnableUserAccount':['hasToken','isAdmin'],
	    'GetListUsers':['hasToken','isAdmin'],
	    'RemoveIdentifierImage':['hasToken','isAdmin'],
      'CheckExistUser':true,
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		
  	},

  	'UserAccount/v0_1/AuthController':{
  		'login':true,
  		'logout':'hasToken'
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		'CreateUserActivation':true,
  		'Activation':true,
  		'DeactivationUserAccount':['hasToken','isAdmin'],
  		'ActivationUserAccount':['hasToken','isAdmin']
  	},
}