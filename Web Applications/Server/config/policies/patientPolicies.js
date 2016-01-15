module.exports={
	'Patient/PatientController':{

		'GetListCountry': true,
		'LoadListPatient':['isAuthenticated','isAdmin'],
		'PatientController': ['isAuthenticated','isAdmin'],
		'CheckPatient': true,
		'SearchPatient':true,
		'RegisterPatient':true
		
	}
}