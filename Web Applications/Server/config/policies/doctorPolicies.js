module.exports={
	'Doctor/DoctorController':{

		'ListCountry': true,
		'LoadlistDoctor':['isAuthenticated','isAdmin'],
		'CreateDoctorByNewAccount': ['isAuthenticated','isAdmin']
		
	}
}