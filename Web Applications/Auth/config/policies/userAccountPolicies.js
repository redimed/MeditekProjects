module.exports={
	'UserAccount/v0_1/UserAccountController':{
      // 'Test':['checkCookieToken'],
      'Test': true,
	    'TestPost':['isAuthenticated'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['isAuthenticated','isAdmin'],
	    'DisableUserAccount':['isAuthenticated','isAdmin'],
	    'EnableUserAccount':['isAuthenticated','isAdmin'],
	    'GetListUsers':['isAuthenticated','isAdmin'],
	    'RemoveIdentifierImage':['isAuthenticated','isAdmin'],
      'CheckExistUser':true,
      'forceChangePass':true,
      'TestSocket':['isAuthenticated'],
      'TestPushNotify':true,
      'TestPushEmail':true,
      'TestPushSMS':true,
      'TestPushFinishJob':true,
      'TestPushBuryJob':true,
  	},

  	'UserAccount/v0_1/RefreshTokenController':{
  		'GetNewToken':true,
  	},

  	'UserAccount/v0_1/AuthController':{
  		'login':true,
      'makeUserOwnRoom':true,
      'logout':'isAuthenticated',
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		'CreateUserActivation':true,
      'Activation':true,
  		'CheckActivated':true,
  		'DeactivationUserAccount':['isAuthenticated','isAdmin'],
  		'ActivationUserAccount':['isAuthenticated','isAdmin']
  	},
}