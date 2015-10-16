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
module.exports.routes = routes;
