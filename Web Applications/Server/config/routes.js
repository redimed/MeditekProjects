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
module.exports.routes = routes;
