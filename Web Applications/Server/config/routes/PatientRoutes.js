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

	'post /api/patient/register-patient' : {
	    controller: 'Patient/PatientController',
	    action :'RegisterPatient'
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
	},

	'post /api/patient/loadlist-patient': {
	    controller: 'Patient/PatientController',
	    action :'LoadListPatient'
	},

	'post /api/patient/detail-patient'   : {
	    controller: 'Patient/PatientController',
	    action :'DetailPatient'
	},

	'post /api/patient/check-patient'    : {
		controller: 'Patient/PatientController',
		action :'CheckPatient'
	},

	'get /api/patient/get-listcountry' :{
		controller: 'Patient/PatientController',
		action: 'GetListCountry'
	},
	'post /api/patient/get-fileUID' :{
		controller: 'Patient/PatientController',
		action: 'getfileUID'
	},
	'post /api/patient/add-child' :{
		controller: 'Patient/PatientController',
		action:'AddChild'
	},
	'post /api/patient/change-status-child' :{
		controller: 'Patient/PatientController',
		action:'ChangeStatusChild'
	},

	'post /api/patient/detail-child-patient':{
		controller: 'Patient/PatientController',
		action:'DetailChild'
	},

	'post /api/patient/send-email-when-linked':{
		controller: 'Patient/PatientController',
		action: 'SendEmailWhenLinked'
	},

	'post /api/patient/update-signature':{
		controller: 'Patient/PatientController',
		action:'UpdateSignature'
	},

	'post /api/patient/update-eform-appt': {
		controller: 'Patient/PatientController',
		action: 'UpdateEFormAppointment'
	},

	'post /api/patient/load-child-node': {
		controller: 'Patient/PatientController',
		action: 'LoadChildNode'
	},

	'post /api/patient/create-patient-for-onlinebooking': {
		controller: 'Patient/PatientController',
		action: 'CreatePatientForOnlineBooking'
	},
	'post /api/patient/list-telehealth': {
		controller: 'Patient/PatientController',
		action: 'GetListPatientTelehealth'
	}
}
