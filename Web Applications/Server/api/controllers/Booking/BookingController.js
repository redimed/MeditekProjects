module.exports = {
    GetListBooking: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListBooking(data, req.user)
                .then(function(success) {
                    res.ok(success);
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    RequestBooking: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestBooking(data, req.user)
                .then(function(success) {
                    if (!_.isEmpty(success) &&
                        !_.isEmpty(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok({
                        status: 'success'
                    });
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    UpdateRequestBooking: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.UpdateRequestBooking(data, req.user)
                .then(function(success) {
                    if (!_.isEmpty(success) &&
                        !_.isEmpty(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok({
                        status: 'success'
                    });
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    GetDetailBooking: function(req, res) {
        var UID = req.param('UID');
        Services.GetDetailBooking(UID, req.user)
            .then(function(apptRes) {
                res.ok(apptRes);
            }, function(err) {
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
    DestroyBooking: function(req, res) {
        var UID = req.param('UID');
        Services.DestroyBooking(UID, req.user)
            .then(function(bookingDestroyed) {
                res.ok({
                    status: 'success'
                });
            }, function(err) {
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
};
