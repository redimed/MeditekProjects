module.exports={
	'UserAccount/v0_1/UserAccountController':{
	    'Test':['hasToken','isAdminOrAssistant'],
	    'TestURL':'checkVersion',
	    'CreateUserAccount':['hasToken','isAdmin'],
	    'DisableUserAccount':['hasToken','isAdmin'],
	    'EnableUserAccount':['hasToken','isAdmin'],
	    'GetListUsers':['hasToken','isAdmin'],
	    'RemoveIdentifierImage':['hasToken','isAdmin']
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
  		'DeactivationUserAccount':['hasToken','isAdmin'],
  		'ActivationUserAccount':['hasToken','isAdmin']
  	},
}