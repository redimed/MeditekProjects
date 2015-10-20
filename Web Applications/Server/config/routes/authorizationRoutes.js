module.exports={
	'get /api/module/GetModulesForUser':{
		controller:'Authorization/v0_1/ModuleController',
		action:'GetModulesForUser'
	},

	'post /api/user-role/CreateUserRole':{
		controller:'Authorization/v0_1/UserRoleController',
		action:'CreateUserRole'
	},

	'get /api/user-role/GetRolesOfUser':{
		controller:'Authorization/v0_1/UserRoleController',
		action:'GetRolesOfUser'
	}
}