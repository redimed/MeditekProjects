var routes = {};
var _ = require('lodash');


// Begin Module File Doctor
var DoctorRoutes = require('./routes/DoctorRoutes');
_.extend(routes, DoctorRoutes);
// End Module File Doctor

// Begin Module File Telehealth
var TelehealthRoutes = require('./routes/TelehealthRoutes');
_.extend(routes, TelehealthRoutes);
// End Module File Telehealth

// Begin Module File WorkInjury
var WorkInjuryRoutes = require('./routes/WorkInjuryRoutes');
_.extend(routes, WorkInjuryRoutes);
// End Module File WorkInjury

// Begin Module File Socket
var SocketRoutes = require('./routes/SocketRoutes');
_.extend(routes, SocketRoutes);
// End Module File Socket

// Begin Module File WorkInjury
var WorkInjuryRoutes = require('./routes/WorkInjuryRoutes');
_.extend(routes, WorkInjuryRoutes);
// End Module File WorkInjury


module.exports.routes = routes;
