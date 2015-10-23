module.exports={
	'UserAccount/v0_1/UserAccountController':{
	    'Test':['hasToken','isActivated','isAdmin'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['isAdmin'],
	    'DisableUserAccount':['isAdmin'],
	    'EnableUserAccount':['isAdmin'],
	    'GetListUsers':['isAdmin'],
	    'RemoveIdentifierImage':['isAdmin']
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		
  	},

  	'UserAccount/v0_1/AuthController':{
  		'login':true,
  		'logout':true
  	},

  	'UserAccount/v0_1/UserActivationController':{
  		'CreateUserActivation':true,
  		'Activation':true,
  		'DeactivationUserAccount':['isAdmin'],
  		'ActivationUserAccount':['isAdmin']
  	},
}