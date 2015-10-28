module.exports={
	'Doctor/DoctorController':{
		'*':true,
		'ListCountry': true,
		'GetDoctor': ['hasToken'],
		'DoctorAppointment': ['hasToken'],
		'DoctorIDAppointment': ['hasToken'],
		'GetDepartment': ['hasToken'],
		'CreateDoctor': ['hasToken'],
		'GetBy': ['hasToken'],
		'UpdateDoctor': ['hasToken'],
		'GetFile': ['hasToken'],
		'RemoveImage': ['hasToken'],
		'GetRoleDoctor': ['hasToken'],
		'GetOneDepartment': ['hasToken']
	}
}