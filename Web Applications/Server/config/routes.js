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

//module user account
routes['get /api/user-account/test']={
	controller:'UserAccount/UserAccountController',
	action:'Test'
};
routes['post /createUser']={
	controller:'UserAccount/UserAccountController',
	action:'createUser'
};
routes['post /login']={
    controller:'UserAccount/AuthController',
    action:'login'
};
routes['get /user-account/find-by-phone']={
    controller:'UserAccount/UserAccountController',
    action:'FindByPhoneNumber'
};
module.exports.routes = routes;
