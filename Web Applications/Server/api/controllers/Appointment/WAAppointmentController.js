var $q = require("q");
var moment = require("moment");
var o=require("../../services/HelperService");
module.exports = {
    /*
     RequestWAAppointment - Controller: request new Appointment for WA Appointment
     input: infomation new WA Appointment, infomation created
     output: -success: transaction created new WA Appointment
     -error: [transaction] created new WA Appointment, error message
     */
    RequestWAAppointment: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestWAAppointment(data, req.user)
                .then(function (success) {
                    success.transaction.commit();
                    res.ok('success');
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    /*
     GetListWAAppointment - Controller: get list WA Appointment with condition received
     input: information filter list WA Appointment, information user filter
     output: -success: list WA Appointment
     -error: [transaction] load list WA Appointment, error message.
     */
    GetListWAAppointment: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            //filter WAAppointment
            // if (!HelperService.CheckExistData(data.Filter)) {
            //     data.Filter = [];
            // }
            // data.Filter.push({
            //     "TelehealthAppointment": {
            //         "Type": "WAA"
            //     }
            // });
            Services.GetListAppointment(data, req.user)
                .then(function (success) {
                    res.ok(success.data);
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    /*
     GetDetailWAAppointment - Controller: get information detail WA Appointment
     input: UID WA Appointment
     output: -success: information details WA Appointment
     -error: [transaction] information details WA Appointment, error message
     */
    GetDetailWAAppointment: function (req, res) {
        var UID = req.params.UID;
        Services.GetDetailWAAppointment(UID, req.user)
            .then(function (success) {
                res.ok(success);
            }, function (err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction) &&
                    HelperService.CheckExistData(err.error)) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                } else {
                    res.serverError(ErrorWrap(err));
                }
            });
    },
    /*
     UpdateRequestWAAppointment - Controller: Update information WA Appointment
     input: new information WA Appointment
     output: - success: transaction updated WA Appointment
     - failed: [transaction] updated WA Appointment, error message
     */
    UpdateRequestWAAppointment: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            var role = HelperService.GetRole(req.user.roles);
            if (role.isInternalPractitioner ||
                role.isAdmin ||
                role.isAssistant) {
                Services.UpdateRequestWAAppointment(data, req.user)
                    .then(function (success) {
                        success.transaction.commit();
                        res.ok('success');
                    }, function (err) {
                        if (HelperService.CheckExistData(err) &&
                            HelperService.CheckExistData(err.transaction) &&
                            HelperService.CheckExistData(err.error)) {
                            err.transaction.rollback();
                            res.serverError(ErrorWrap(err.error));
                        } else {
                            res.serverError(ErrorWrap(err));
                        }
                    });
            } else {
                res.serverError('user.not(interalPractitioner,admin,assistant)');
            }

        }
    },
    /*
     DisableWAAppointment - Controller: Delete  a WA Appointment
     input: UID Appointment
     output: - success: transaction updated Enable is 'N' WA Appointment
     - error: [transaction] updated Enable is 'N' WA Appointment, error message
     */
    DisableWAAppointment: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DisableAppointment(data)
                .then(function (success) {
                    success.transaction.commit();
                    res.ok('success');
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    RequestWAAppointmentPatient: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestWAAppointmentPatient(data, req.user)
                .then(function (success) {
                    success.transaction.commit();
                    res.ok({
                        status: 'success',
                        code: success.code
                    });
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    GetDetailWAAppointmentforEform: function (req, res) {
        var UID = req.params.UID;
        Services.GetDetailWAAppointmentforEform(UID)
            .then(function (success) {
                res.ok(success);
            }, function (err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction) &&
                    HelperService.CheckExistData(err.error)) {
                    err.transaction.rollback();
                    res.serverError(ErrorWrap(err.error));
                } else {
                    res.serverError(ErrorWrap(err));
                }
            });
    },
    GetListWAAppointmentConsultation: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        var objRequired = {
            Patient: true
        };
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListAppointment(data, req.user, objRequired)
                .then(function (success) {
                    res.ok(success.data);
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    RequestWAAppointmentPatientOnlineBooking: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestWAAppointmentPatient(data, req.user)
                .then(function (success) {
                    success.transaction.commit();
                    res.ok({
                        status: 'success',
                        code: success.code
                    });
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },
    RequestAppointmentCompany: function (req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestAppointmentCompany(data, req.user)
                .then(function (success) {
                    success.transaction.commit();
                    res.ok({
                        status: 'success',
                        code: success.code
                    });
                }, function (err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction) &&
                        HelperService.CheckExistData(err.error)) {
                        err.transaction.rollback();
                        res.serverError(ErrorWrap(err.error));
                    } else {
                        res.serverError(ErrorWrap(err));
                    }
                });
        }
    },


    RequestAppointmentMedicalBooking: function (req, res) {
        var error = new Error("RequestAppointmentMedicalBooking");
        var rawdata = req.body;
        var data = {};
        function Preprocessing() {
            var q = $q.defer();
            try {
                if (!rawdata.headerId)
                    error.pushError("headerId.null");
                if (!rawdata.companyId)
                    error.pushError("companyId.null");
                if (!rawdata.BookingCandidates || rawdata.BookingCandidates.length < 1) {
                    error.pushError("BookingCandidates.empty");
                } else {
                    for (var i = 0; i < rawdata.BookingCandidates.length; i++) {
                        var item = rawdata.BookingCandidates[i];
                        if(!item.candidateId)
                        {
                            error.pushError("candidateId.null."+i);
                        }
                        /*if(item.DOB && !moment(item.DOB, "DD/MM/YYYY").isValid()) {
                            error.pushError("DOB.invalid."+i);
                        }*/
                        if(item.preferredFromDate && !moment(item.preferredFromDate,"YYYY-MM-DD Z", true).isValid()) {
                            error.pushError("preferredFromDate.invalid." + i);
                        }
                        if(item.preferredToDate && !moment(item.preferredToDate,"YYYY-MM-DD Z", true).isValid()) {
                            error.pushError("preferredToDate.invalid." + i);
                        }
                        if(item.AppointmentTime && !moment(item.AppointmentTime,"YYYY-MM-DD HH:mm:ss Z", true).isValid()) {
                            error.pushError("AppointmentTime.invalid." + i);
                        }
                        if(item.email && !o.isValidEmail(item.email)) {
                            error.pushError("email.invalid."+i);
                        }
                        if(item.mobile)
                        {
                            var m = o.parseAuMobilePhone(item.mobile);
                            if (m)
                                item.mobile =  m;
                            else
                                error.pushError("mobile.invalid."+i);
                        }

                    }
                }


                if (error.getErrors().length > 0)
                    throw error;
                else
                    q.resolve("success");
            }
            catch (e) {
                q.reject(e);
            }
            return q.promise;
        }

        Preprocessing()
        .then(function (checked) {
            return Services.Company.loadDetail({model: 'CompanySite', whereClause: {ID: rawdata.companyId}})
        })
        .then(function(companySite){
            if (!companySite) {
                error.pushError("company.notFound");
                throw error;
            }
            data.Appointments = [];
            for (var i = 0; i < rawdata.BookingCandidates.length; i++) {
                var candidateInfo = rawdata.BookingCandidates[i];
                var appointment = {
                    FromTime: candidateInfo.AppointmentTime,
                    Type: 'PreEmployment',
                    PatientAppointment: {
                        FirstName: candidateInfo.CandidateName,
                        DOB: candidateInfo.DOB,
                        Email1: candidateInfo.email,
                        PhoneNumber: candidateInfo.mobile
                    },
                    AppointmentData: [
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'headerId',
                            Value: rawdata.headerId || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'packageDescription',
                            Value: rawdata.packageDescription || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'Paperwork',
                            Value: rawdata.Paperwork || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'Notes',
                            Value: rawdata.Notes || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'companySiteId',
                            Value: companySite.ID || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingHeader',
                            Name: 'SiteIDRefer',
                            Value: rawdata.companyId || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'candidateId',
                            Value: candidateInfo.candidateId || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'Position',
                            Value: candidateInfo.Position || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'preferredFromDate',
                            Value: candidateInfo.preferredFromDate || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'preferredToDate',
                            Value: candidateInfo.preferredToDate || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'preferredToDate',
                            Value: candidateInfo.preferredSiteId || null
                        },
                        {
                            Category: 'Appointment',
                            Section: 'MedicalBooking',
                            Type: 'BookingCandidate',
                            Name: 'Notes',
                            Value: candidateInfo.Notes || null
                        },
                    ]

                }
                data.Appointments.push(appointment);
            }
            return Services.RequestAppointmentCompany(data, req.user);
        })
        .then(function (success) {
            success.transaction.commit();
            res.ok({
                status: 'success',
                code: success.code
            });
        })
        .catch(function(err){
            if (HelperService.CheckExistData(err) &&
                HelperService.CheckExistData(err.transaction) &&
                HelperService.CheckExistData(err.error)) {
                err.transaction.rollback();
                res.serverError(ErrorWrap(err.error));
            } else {
                res.serverError(ErrorWrap(err));
            }
        })
    }
};
