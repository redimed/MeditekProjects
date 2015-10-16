module.exports = {

	'post /api/getDoctor': {
		controller:'Doctor/DoctorController',
    	action:'GetDoctor'
	},
	'post /api/checkPhone': {
		controller:'Doctor/DoctorController',
    	action:'CheckPhone'
	},
	'post /api/checkEmail': {
		controller:'Doctor/DoctorController',
    	action:'CheckEmail'
	},
	'post /api/checkphoneUserAccount': {
		controller:'Doctor/DoctorController',
    	action:'CheckPhoneUserAccount'
	},
	'get /api/doctorappointment': {
		controller:'Doctor/DoctorController',
    	action:'doctorAppointment'
	},
	'post /api/doctorIdappointment': {
		controller:'Doctor/DoctorController',
    	action:'doctorIDAppointment'
	}
	// 'post /api/getbyidDoctor': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'GetByIdDoctor'
	// },
	// 'post /api/createDoctor': {
	// 	controller:'Doctor/DoctorController',
	// 	action:'CreateDoctor'
	// }
	// 'post /api/createDoctor': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'CreateDoctor'
	// }
	// 'post /api/sendsms': {
	// 	controller:'Doctor/DoctorController',
	// 	action:'SendSMS'
	// }
	// 'post /api/createDoctors': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'CreateDoctors'
	// },
	// 'post /api/updateDoctor': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'UpdateDoctor'
	// },
	// 'post /api/searchDoctor': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'SearchDoctor'
	// }
	// 'post /api/endisableDoctor': {
	// 	controller:'Doctor/DoctorController',
 //    	action:'StatusDoctor'
	// }

};