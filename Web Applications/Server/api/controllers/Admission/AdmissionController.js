module.exports = {
    RequestAdmission: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestAdmission(data, req.user)
                .then(function(success) {
                    if (HelperService.CheckExistData(success) &&
                        HelperService.CheckExistData(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok({ admissionResponse: success.admissionResponse });
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    GetListAdmission: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data == false) {
            res.serverError('data failed');
        } else {
            Services.GetListAdmission(data, req.user)
                .then(function(AdmissionDetailRes) {
                    res.ok(AdmissionDetailRes.data);
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    UpdateRequestAdmission: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.UpdateRequestAdmission(data, req.user)
                .then(function(success) {
                    if (HelperService.CheckExistData(success) &&
                        HelperService.CheckExistData(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok('success');
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    DestroyAdmission: function(req, res) {
        var UID = req.param('UID');
        Services.DestroyAdmission(UID, req.user)
            .then(function(success) {
                if (HelperService.CheckExistData(success) &&
                    HelperService.CheckExistData(success.transaction)) {
                    success.transaction.commit();
                }
                res.ok('success');
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err.error || err));
            });
    },
    GetDetailAdmission: function(req, res) {
        var UID = req.param('UID');
        Services.GetDetailAdmission(UID, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                res.serverError(ErrorWrap(err.error || err));
            });
    }
};
