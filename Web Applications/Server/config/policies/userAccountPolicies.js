module.exports={
	'UserAccount/v0_1/UserAccountController':{
      // 'Test':['checkCookieToken'],
      'Test':['isIp'],
	    'TestPost':['isAuthenticated'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['isAuthenticated','isAdmin'],
	    'DisableUserAccount':['isAuthenticated','isAdmin'],
	    'EnableUserAccount':['isAuthenticated','isAdmin'],
	    'GetListUsers':['isAuthenticated','isAdmin'],
	    'RemoveIdentifierImage':['isAuthenticated','isAdmin'],
      'CheckExistUser':true,
      'forceChangePass':true,
	  //'GeneratePassword':true,
	  'forgetPassword':true,
	},

  	'UserAccount/v0_1/UserActivationController':{

  	},

  	'UserAccount/v0_1/AuthController':{
  		'login':true,
      'forgot':true,
      'check':true,
      'changePassforgot':true,
  		'logout':'isAuthenticated',
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		'CreateUserActivation':true,
  		'Activation':true,
  		'DeactivationUserAccount':['isAuthenticated','isAdmin'],
  		'ActivationUserAccount':['isAuthenticated','isAdmin']
  	},
}
