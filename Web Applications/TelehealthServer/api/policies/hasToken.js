var expressJwt = require('express-jwt');
var config = sails.config.myconf;

module.exports = expressJwt({secret: config.TokenSecret});