var routes = {};
var _ = require('lodash');

//Begin Module User Account 
var userAccountRoutes = require('./routes/userAccountRoutes');
_.extend(routes, userAccountRoutes);
//End Module User Account


var authorizationRoutes = require('./routes/authorizationRoutes');
_.extend(routes, authorizationRoutes);


/*
    ------------------ Register -----------------------
*/
var RegisterRoutes = require('./routes/RegisterRoutes');
_.extend(routes, RegisterRoutes);
/*
    ------------------ End Register -------------------
    -------------------------------------------------
*/

var pushTrackingRoutes = require('./routes/pushTrackingRoutes');
_.extend(routes, pushTrackingRoutes);

module.exports.routes = routes;
