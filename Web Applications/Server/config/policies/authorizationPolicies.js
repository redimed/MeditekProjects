module.exports={
	'Authorization/v0_1/ModuleController':{
	    'GetModulesForUser':['hasToken'],
  	},

  	'Authorization/v0_1/UserRoleController':{
	    'CreateUserRoleWithExistUser':['hasToken','checkVersion'],
	    'CreateUserRoleWhenCreateUser':['hasToken','checkVersion'],
	    'GetRolesOfUser':['hasToken','checkVersion']
  	},
}