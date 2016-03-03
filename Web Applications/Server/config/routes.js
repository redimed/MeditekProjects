var routes = {};
var _ = require('lodash');

//Begin Module User Company 
var CompanyRoutes = require('./routes/CompanyRoutes');
_.extend(routes, CompanyRoutes);
//End Module User Company

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

//begin module Roster
var RosterRoutes = require('./routes/RosterRoutes');
_.extend(routes, RosterRoutes);
//end module Roster

//begin module Booking
var BookingRoster = require('./routes/BookingRoutes');
_.extend(routes, BookingRoster);
//end module Booking

//begin module Paperless
var PaperlessRoutes = require('./routes/PaperlessRoutes');
_.extend(routes, PaperlessRoutes);
//end module Roster

//begin module EForm
var EFormRoutes = require('./routes/EFormRoutes');
_.extend(routes, EFormRoutes);
//end module EForm
//begin module SystemSetting
var SystemSettingRoutes = require('./routes/SystemSettingRoutes');
_.extend(routes, SystemSettingRoutes);
//end module SystemSetting
module.exports.routes = routes;
