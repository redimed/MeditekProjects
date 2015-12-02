module.exports = {

	'post /api/doctor/loadlist-doctor': {
		controller:'Doctor/DoctorController',
    	action:'LoadlistDoctor'
	},

	'post /api/doctor/detail-doctor': {
		controller:'Doctor/DoctorController',
    	action:'DetailDoctor'
	},

	'post /api/doctor/update-doctor': {
		controller:'Doctor/DoctorController',
    	action:'UpdateDoctor'
	},

	'post /api/doctor/get-doctor' :{
		controller:'Doctor/DoctorController',
		action:'GetDoctor'
	},

	'post /api/doctor/check-doctor' :{
		controller:'Doctor/DoctorController',
		action:'CheckDoctor'
	},

	'post /api/doctor/check-info':{
		controller:'Doctor/DoctorController',
		action:'CheckInfo'
	},

	'post /api/doctor/create-doctor-by-newaccount':{
		controller:'Doctor/DoctorController',
		action:'CreateDoctorByNewAccount'
	},

	'post /api/doctor/getlist-speciality':{
		controller:'Doctor/DoctorController',
		action:'GetListSpeciality'
	},

	'post /api/doctor/update-sign':{
		controller:'Doctor/DoctorController',
		action:'UpdateSignature'
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