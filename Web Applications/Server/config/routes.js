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

//module user account
routes['get /api/user-account/test']={
	controller:'UserAccount/UserAccountController',
	action:'Test'
};
routes['post /api/user-account/CreateUserAccount']={
	controller:'UserAccount/UserAccountController',
	action:'CreateUserAccount'
};
routes['post /login']={
    controller:'UserAccount/AuthController',
    action:'login'
};
routes['get /api/user-account/find-by-phone']={
    controller:'UserAccount/UserAccountController',
    action:'FindByPhoneNumber'
};

module.exports.routes = routes;
