module.exports={
	'Doctor/DoctorController':{

		'ListCountry': true,
		'LoadlistDoctor':['isAuthenticated'],
		'CreateDoctorByNewAccount': ['isAuthenticated','isAdmin']
		
	}
}