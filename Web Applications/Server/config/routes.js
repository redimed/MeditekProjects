var routes = {};
//mdule urgent care
routes['post /api/urgent-care/urgent-request'] = {
    controller: 'UrgentCare/UrgentCareController',
    action: 'ReceiveRequest'
};

routes['get /api/urgent-care/urgent-confirm/:id'] = {
    controller: 'UrgentCare/UrgentCareController',
    action: 'ConfirmRequest'
};

//module appointment
routes['get /api/appointment-telehealth-request'] = {
    controller: 'Appointment/AppointmentController',
    action: 'RequestAppointment'
};

//module patient
routes['post /api/patient/create-patient'] = {
	controller: 'Patient/PatientController',
	action :'CreatePatient'
};

routes['post /api/patient/search-patient'] = {
	controller: 'Patient/PatientController',
	action :'SearchPatient'
};

//end module patient

module.exports.routes = routes;
