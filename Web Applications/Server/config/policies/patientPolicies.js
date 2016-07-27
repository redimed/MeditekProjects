module.exports={
	'Patient/PatientController':{

		'GetListCountry': true,
		'LoadListPatient':['isAuthenticated','isAdmin','isAdminOrAssistant','isExternalPractitioner','isInternalPractitioner'],
		'PatientController': ['isAuthenticated','isAdmin'],
		'CheckPatient': true,
		'SearchPatient':true,
		'RegisterPatient':true,
		'GetPatient':true
		
	}
}