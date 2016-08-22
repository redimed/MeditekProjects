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
    GetDetailCompanyByUser: function(req, res) {
        var headers = req.headers;
        var userUid = req.params.all().userUid;

        if (userUid != null) {
            WorkInjuryService.GetDetailCompanyByUser(headers, userUid).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetDetailCompanyByUser.Error');
            err.pushError("Invalid Params userUid");
            res.serverError(ErrorWrap(error));
        }
    },
    GetListStaff: function(req, res) {
        var headers = req.headers;
        var userUid = req.params.all().userUid;

        if (userUid != null) {
            WorkInjuryService.GetListStaff(headers, userUid).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetListStaff.Error');
            err.pushError("Invalid Params userUid");
            res.serverError(ErrorWrap(error));
        }
    },
    GetListSite: function(req, res) {
        var headers = req.headers;
        var companyUid = req.params.all().companyUid;

        if (companyUid != null) {
            WorkInjuryService.GetListSite(headers, companyUid).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetListSite.Error');
            err.pushError("Invalid Params companyUid");
            res.serverError(ErrorWrap(error));
        }
    },
    GetDetailPatient: function(req, res) {
        var headers = req.headers;
        var body = req.body;

        if (!_.isEmpty(body)) {
            WorkInjuryService.GetDetailPatient(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetDetailPatient.Error');
            err.pushError("Invalid Params UID");
            res.serverError(ErrorWrap(error));
        }
    },
    GetUserAccountDetail: function(req, res) {
        var headers = req.headers;
        var UID = req.params.all().UID ? req.params.all().UID : null;

        if (UID != null) {
            WorkInjuryService.GetUserAccountDetail(headers, UID).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.GetUserAccountDetail.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    AppointmentRequestCompany: function(req, res) {
        var body = req.body;
        var headers = req.headers;

        if (!_.isEmpty(body)) {
            WorkInjuryService.AppointmentRequestCompany(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.AppointmentRequestCompany.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    AppointmentRequestPatient: function(req, res) {
        var body = req.body;
        var headers = req.headers;

        if (!_.isEmpty(body)) {
            WorkInjuryService.AppointmentRequestPatient(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.AppointmentRequestPatient.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    EformRedisite: function(req, res) {
        var body = req.body;
        var headers = req.headers;

        if (!_.isEmpty(body)) {
            WorkInjuryService.EformRedisite(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.EformRedisite.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    },
    LoadDetailCompany: function(req, res) {
        var body = req.body;
        var headers = req.headers;

        if (!_.isEmpty(body)) {
            WorkInjuryService.LoadDetailCompany(headers, body).then(function(response) {
                if (response.getHeaders().requireupdatetoken) res.set("requireupdatetoken", response.getHeaders().requireupdatetoken);
                return res.ok(response.getBody());
            }, function(err) {
                return res.json(err.getCode(), err.getBody());
            });
        } else {
            var error = new Error('Telehealth.LoadDetailCompany.Error');
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(error));
        }
    }
};
