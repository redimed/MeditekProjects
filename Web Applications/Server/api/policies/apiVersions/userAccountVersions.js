var userAccountController_v0_1=require("../../controllers/UserAccount/v0_1/UserAccountController");
var userAccountController_v0_2=require("../../controllers/UserAccount/v0_2/UserAccountController");
var userAccountController_v0_3=require("../../controllers/UserAccount/v0_3/UserAccountController");

module.exports={
	'get /api/user-account/test':{
		'0.1':{
			enable:false,
			action:userAccountController_v0_1.Test
		},

		'0.2': {
			enable:true,
			action:userAccountController_v0_2.Test
		},

		'0.3':{
			enable:true,
			action:userAccountController_v0_3.Test
		}
	},

	'get /api/user-account/test-url/:param1/:param2/:param3':{
		'0.1':{
			enable:true,
			action:userAccountController_v0_1.TestURL
		}
	}
}