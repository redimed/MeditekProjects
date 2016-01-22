module.exports = {
    RequestRoster: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestRoster(data, req.user)
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
                    if (!_.isEmpty(err) &&
                        !_.isEmpty(err.data)) {
                        res.serverError({
                            error: 'overlaps',
                            data: err.data
                        });
                    } else {
                        res.serverError(ErrorWrap(err.error || err));
                    }
                });
        }
    },
    UpdateRequestRoster: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.UpdateRequestRoster(data, req.user)
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
    GetDetailRoster: function(req, res) {
        var UID = req.param('UID');
        Services.GetDetailRoster(UID, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                res.serverError(ErrorWrap(err.error || err));
            });
    },
    GetListRoster: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListRoster(data, req.user)
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
    DestroyRoster: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.DestroyRoster(data, req.user)
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
                    if (HelperService.CheckExistData(err.data)) {
                        res.serverError({
                            error: ErrorWrap(err.error),
                            data: err.data
                        });
                    } else {
                        res.serverError(ErrorWrap(err.error || err));
                    }
                });
        }
    },
    GetListService: function(req, res) {
        Services.GetListService()
            .then(function(listServiceRes) {
                res.ok(listServiceRes);
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err.error || err));
            });
    },
    GetListSite: function(req, res) {
        Services.GetListSite()
            .then(function(listSites) {
                res.ok(listSites);
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err.error || err));
            });
    }
};
