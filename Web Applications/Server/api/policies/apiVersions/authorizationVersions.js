var moduleController_v0_1=require("../../controllers/Authorization/v0_1/ModuleController");
var userRoleController_v0_1=require("../../controllers/Authorization/v0_1/UserRoleController");
module.exports={
	'get /api/module/GetModulesForUser':{
		'0.1':{
			enable:false,
			action:moduleController_v0_1.GetModulesForUser
		}
	},

	'post /api/user-role/CreateUserRole':{
		'0.1':{
			enable:true,
			action:userRoleController_v0_1.CreateUserRole
		}
	},

	'get /api/user-role/GetRolesOfUser':{
		'0.1':{
			enable:true,
			action:userRoleController_v0_1.GetRolesOfUser
		}
	}
}