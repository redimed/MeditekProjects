module.exports={
	'Doctor/DoctorController':{
		'*':true,
		'ListCountry': true,
		'GetDoctor': ['isAuthenticated'],
		'DoctorAppointment': ['isAuthenticated'],
		'DoctorIDAppointment': ['isAuthenticated'],
		'GetDepartment': ['isAuthenticated'],
		'CreateDoctor': ['isAuthenticated'],
		'GetBy': ['isAuthenticated'],
		'UpdateDoctor': ['isAuthenticated'],
		'GetFile': ['isAuthenticated'],
		'RemoveImage': ['isAuthenticated'],
		'GetRoleDoctor': ['isAuthenticated'],
		'GetOneDepartment': ['isAuthenticated']
	}
}