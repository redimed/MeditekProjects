module.exports={
	'Patient/PatientController':{

		// 'ListCountry': true,
		'LoadListPatient':['isAuthenticated','isAdmin'],
		'PatientController': ['isAuthenticated','isAdmin'],
		'CheckPatient': true
		
	}
}