module.exports = {

	'post /api/getDoctor': {
		controller:'Doctor/DoctorController',
    	action:'GetDoctor'
	},
	'get /api/doctorappointment': {
		controller:'Doctor/DoctorController',
    	action:'DoctorAppointment'
	},
	'post /api/doctorIdappointment': {
		controller:'Doctor/DoctorController',
    	action:'DoctorIDAppointment'
	},
	'get /api/listCountry': {
		controller:'Doctor/DoctorController',
		action:'ListCountry'
	},
	'get /api/getdepartment': {
		controller:'Doctor/DoctorController',
		action:'GetDepartment'
	},
	'post /api/createDoctor': {
		controller:'Doctor/DoctorController',
		action:'CreateDoctor'
	},
	'post /api/getbyidDoctor': {
		controller:'Doctor/DoctorController',
    	action:'GetBy'
	},
	'post /api/updateDoctor': {
		controller:'Doctor/DoctorController',
    	action:'UpdateDoctor'
	},
	'post /api/getFile': {
		controller:'Doctor/DoctorController',
    	action:'GetFile'
	},
	'post /api/removeImage': {
		controller:'Doctor/DoctorController',
    	action:'RemoveImage'
	},
	'post /api/getRoleDoctor': {
		controller:'Doctor/DoctorController',
    	action:'GetRoleDoctor'
	},
	'post /api/getOneDepartment': {
		controller:'Doctor/DoctorController',
		action:'GetOneDepartment'
	}
	

};