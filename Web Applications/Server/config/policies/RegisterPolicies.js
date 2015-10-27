module.exports={
	'Register/RegisterController':{
		'*':true,
		'ConfirmActivated':['hasToken'],
		// 'SendSMS':true,
		// 'CheckPhoneUserAccount':true,
		// 'EnableFile':true,
	}
}