var _ = require('underscore');
var routes = {};

//module appointment
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

// //module patient
// routes['post /api/patient/create-patient'] = {
//     controller: 'Patient/PatientController',
//     action :'CreatePatient'
// };

// routes['post /api/patient/search-patient'] = {
//     controller: 'Patient/PatientController',
//     action :'SearchPatient'
// };

// routes['post /api/patient/update-patient'] = {
//     controller: 'Patient/PatientController',
//     action :'UpdatePatient'
// };

// routes['post /api/patient/get-patient'] = {
//     controller: 'Patient/PatientController',
//     action :'GetPatient'
// };

// routes['post /api/patient/delete-patient'] = {
//     controller: 'Patient/PatientController',
//     action :'DeletePatient'
// };

    // module doctor
routes['post /api/getDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'GetDoctor'
};
routes['post /api/getbyidDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'GetByIdDoctor'
};
routes['post /api/createDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'CreateDoctor'
};
routes['post /api/createDoctors'] = {
    controller: 'Doctor/DoctorController',
    action: 'CreateDoctors'
};
routes['post /api/updateDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'UpdateDoctor'
};
routes['post /api/searchDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'SearchDoctor'
};
routes['post /api/deleteDoctor'] = {
    controller: 'Doctor/DoctorController',
    action: 'DeleteDoctor'
};
// module doctor
routes['post /api/getDoctor']={
    controller:'Doctor/DoctorController',
    action:'GetDoctor'
};
routes['post /api/getbyidDoctor']={
    controller:'Doctor/DoctorController',
    action:'GetByIdDoctor'
};
routes['post /api/createDoctor']={
    controller:'Doctor/DoctorController',
    action:'CreateDoctor'
};
routes['post /api/createDoctors']={
    controller:'Doctor/DoctorController',
    action:'CreateDoctors'
};
routes['post /api/updateDoctor']={
    controller:'Doctor/DoctorController',
    action:'UpdateDoctor'
};
routes['post /api/searchDoctor']={
    controller:'Doctor/DoctorController',
    action:'SearchDoctor'
};
routes['post /api/deleteDoctor']={
    controller:'Doctor/DoctorController',
    action:'DeleteDoctor'
};
//end module doctor

//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------


//Begin Module User Account 
var userAccountRoutes = require('./routes/userAccountRoutes');
_.extend(routes, userAccountRoutes);

var PatientRoutes = require('./routes/PatientRoutes');
_.extend(routes, PatientRoutes);

var AppointmentRoutes = require('./routes/AppointmentRoutes');
_.extend(routes, AppointmentRoutes);

//End Module User Account
//
module.exports.routes = routes;
