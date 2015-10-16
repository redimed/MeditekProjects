var moduleController_v0_1=require("../../controllers/Authorization/v0_1/ModuleController");
module.exports={
	'get /api/module/GetModulesForUser':{
		'0.1':{
			enable:false,
			action:moduleController_v0_1.GetModulesForUser
		}
	}
}