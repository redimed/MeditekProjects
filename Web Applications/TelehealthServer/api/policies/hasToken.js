// var jwt = require('jsonwebtoken');
// var _ = require('lodash');
// var config = sails.config.myconf;
// var fs = require('fs');
// module.exports = function(req, res, next) {
//     if (req.isAuthenticated()) return next();
//     else {
//         var error = new Error("CheckToken");
//         error.pushError("notAuthenticated");
//         return res.unauthorize(ErrorWrap(error));
//     }
// }
var meditek_library=require("meditek_library");
module.exports=meditek_library.isAuthenticated;
