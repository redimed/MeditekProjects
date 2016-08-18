var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = sails.config.myconf;
var _ = require('lodash');
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
//****Send SMS function******
function sendSMS(toNumber, content) {
    return twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    });
};

module.exports = {
	GetDoctor: function(req, res) {
        var headers = req.headers;
        var body = req.body;
        DoctorService.GetDoctor(headers, body).then(function(response) {
            if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
            return res.ok(response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
};

