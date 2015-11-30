module.exports = {

	'post /api/checkphoneUserAccount': {
		controller:'Register/RegisterController',
    	action:'CheckPhoneUserAccount'
	},
	'post /api/createAccount': {
		controller:'Register/RegisterController',
    	action:'CreateAccount'
	},
	'post /api/checkuserNameAccount': {
		controller:'Register/RegisterController',
    	action:'CheckUserNameAccount'
	},
	'post /api/checkemailAccount': {
		controller:'Register/RegisterController',
    	action:'CheckEmailAccount'
	},
	'post /api/sendsms': {
		controller:'Register/RegisterController',
		action:'SendSMS'
	},
	'post /api/confirmActivated': {
		controller:'Register/RegisterController',
    	action:'ConfirmActivated'
	},
	'post /api/createCode': {
		controller:'Register/RegisterController',
    	action:'CreateCode'
	}

};