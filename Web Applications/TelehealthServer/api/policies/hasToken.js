var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = sails.config.myconf;
var fs = require('fs');
module.exports = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    else {
        var error = new Error("CheckToken");
        error.pushError("notAuthenticated");
        return res.unauthorize(ErrorWrap(error));
    }
}