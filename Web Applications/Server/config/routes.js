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

routes['post /api/appointment-update-appointment'] = {
    controller: 'Appointment/AppointmentController',
    action: 'UpdateAppointment'
};
routes['post /api/appointment-delete-appointment'] = {
    controller: 'Appointment/AppointmentController',
    action: 'DeleteAppointment'
};
routes['post /api/appointment-getone-appointment'] = {
    controller: 'Appointment/AppointmentController',
    action: 'DetailOneAppointment'
};
//module redoctorappointment
routes['post /api/redoctorappointment-setdoctor'] = {
    controller: 'ReDoctocAppointment/ReDoctocAppointmentController',
    action: 'SetDoctorForAppointment'
};
//end module redoctorAppointment

//module repatientappointment
routes['post /api/repatientappointment-setpatient'] = {
    controller: 'RePatientAppointment/RelPatientAppointmentController',
    action: 'SetPatientForAppointment'
};
//end module repatientappointment

//module patient
routes['post /api/patient/create-patient'] = {
    controller: 'Patient/PatientController',
    action :'CreatePatient'
};

routes['post /api/patient/search-patient'] = {
    controller: 'Patient/PatientController',
    action :'SearchPatient'
};

routes['post /api/patient/update-patient'] = {
    controller: 'Patient/PatientController',
    action :'UpdatePatient'
};

routes['post /api/patient/get-patient'] = {
    controller: 'Patient/PatientController',
    action :'GetPatient'
};

routes['post /api/patient/delete-patient'] = {
    controller: 'Patient/PatientController',
    action :'DeletePatient'
};

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
route['post /api/user-activation/create-user-activation']={
    controller:'UserAccount/UserActivationController',
    action:'CreateUserActivation'
}

module.exports.routes = routes;
