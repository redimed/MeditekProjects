module.exports={
	// 'get /api/user-activation/activation-web':{
	// 	controller:'UserAccount/UserActivationController',
	// 	action:'ActivationWeb',
	// 	name:'aaa'
	// }

	//module patient
	'post /api/patient/create-patient' : {
	    controller: 'Patient/PatientController',
	    action :'CreatePatient'
	},

	'post /api/patient/search-patient' : {
	    controller: 'Patient/PatientController',
	    action :'SearchPatient'
	},

	'post /api/patient/update-patient' : {
	    controller: 'Patient/PatientController',
	    action :'UpdatePatient'
	},

	'post /api/patient/get-patient'   : {
	    controller: 'Patient/PatientController',
	    action :'GetPatient'
	},

	'post /api/patient/delete-patient': {
	    controller: 'Patient/PatientController',
	    action :'DeletePatient'
	}

}