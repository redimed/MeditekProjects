var routes = {};
var _ = require('lodash');

//Begin Module User Account 
var userAccountRoutes = require('./routes/userAccountRoutes');
_.extend(routes, userAccountRoutes);
//End Module User Account

//Begin Module Patient
var PatientRoutes = require('./routes/PatientRoutes');
_.extend(routes, PatientRoutes);
//End Module Patient

//Begin Module Telehealth Appointment
var AppointmentRoutes = require('./routes/AppointmentRoutes');
_.extend(routes, AppointmentRoutes);
//End Module Telehealth Appointment

var urgentCareRoutes = require('./routes/urgentCareRoutes');
_.extend(routes, urgentCareRoutes);

//End Module User Account
//
var authorizationRoutes = require('./routes/authorizationRoutes');
_.extend(routes, authorizationRoutes);
/*
    ------------------ Doctor -----------------------
*/
var DoctorRoutes = require('./routes/DoctorRoutes');
_.extend(routes, DoctorRoutes);
/*
    ------------------ End Doctor -------------------
    -------------------------------------------------
*/
// Begin Module File Upload
var UploadRoutes = require('./routes/FileUploadRoutes')
_.extend(routes, UploadRoutes);
// End Module File Upload

/*
    ------------------ Register -----------------------
*/
var RegisterRoutes = require('./routes/RegisterRoutes');
_.extend(routes, RegisterRoutes);
/*
    ------------------ End Register -------------------
    -------------------------------------------------
*/

//begin module Consultation
var ConsultationRoutes = require('./routes/ConsultationRoutes');
_.extend(routes, ConsultationRoutes);
//end module Consultation

//begin module Admission
var AdmissionRoutes = require('./routes/AdmissionRoutes');
_.extend(routes, AdmissionRoutes);
//end module Admission

module.exports.routes = routes;
