var jwt = require('jsonwebtoken');
var _ = require('lodash');
var config = sails.config.myconf;
var fs = require('fs');

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("======Header=====: ",req.headers);
        TelehealthService.CheckToken(req.headers).then(function(result) {
            return next();
        }).catch(function(err) {
            return res.serverError(ErrorWrap(err));
        })
    } else {
        var error = new Error("CheckToken");
        error.pushError("notAuthenticated");
        return res.unauthorize(ErrorWrap(error));
    }
}