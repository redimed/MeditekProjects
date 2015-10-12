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

module.exports.routes = routes;
