
module.exports={
	'get /api/user-account/test':{
		controller:'UserAccount/UserAccountController',
		action:'Test',
		// policy:'hasToken'
	},
	// 'get /api/user-account/test':function(req,res){
	// 	res.json({status:"heheehehhehe"});
	// },
	// 
	'get /api/user-account/test-url/:param1/:param2/:param3':{
		controller:'UserAccount/UserAccountController',
		action:'TestURL',
	},

	'post /api/user-account/testPost':{
		controller:'UserAccount/UserAccountController',
		action:'TestPost'
	},

	'post /api/user-account/CreateUserAccount':{
		controller:'UserAccount/UserAccountController',
		action:'CreateUserAccount'
	},

	'put /api/user-account/UpdateUserAccount':{
		controller:'UserAccount/UserAccountController',
		action:'UpdateUserAccount'
	},


	'delete /api/user-account/DisableUserAccount':{
		controller:'UserAccount/UserAccountController',
		action:'DisableUserAccount'
	},

	'put /api/user-account/EnableUserAccount':{
		controller:'UserAccount/UserAccountController',
		action:'EnableUserAccount'
	},

	'put /api/user-activation/DeactivationUserAccount':{
		controller:'UserAccount/UserActivationController',
		action:'DeactivationUserAccount'
	},

	'put /api/user-activation/ActivationUserAccount':{
		controller:'UserAccount/UserActivationController',
		action:'ActivationUserAccount'
	},

	'get /api/user-account/GetUserAccountDetails':
	{
		controller:'UserAccount/UserAccountController',
		action:'GetUserAccountDetails'
	},

	'post /api/user-account/GetListUsers':
	{
		controller:'UserAccount/UserAccountController',
		action:'GetListUsers'
	},

	

	'post /api/login':{
		controller:'UserAccount/AuthController',
    	action:'login'
	},

	'get /api/logout':{
		controller:'UserAccount/AuthController',
		action:'logout'
	},

	'get /api/user-account/find-by-phone':{
		controller:'UserAccount/UserAccountController',
    	action:'FindByPhoneNumber'
	},

	'post /api/user-activation/create-user-activation':{
		controller:'UserAccount/UserActivationController',
    	action:'CreateUserActivation'
	},

	'get /api/user-activation/activation-web':{
		controller:'UserAccount/UserActivationController',
		action:'ActivationWeb'
	},


	'get /test':'TestController.test',
    'get /testAdmin':'TestController.testAdmin',
    'get /testAssistant':'TestController.testAssistant',
    'get /testGp':'TestController.testGp',
    'get /testDoctor':'TestController.testDoctor',
    'get /testPatient':'TestController.testPatient',
};