module.exports = {
    GetListConsultation: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.GetListConsultation(data, req.user)
                .then(function(listConsultation) {
                    res.ok(listConsultation);
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    CreateConsultation: function(req, res) {},
    DetailConsultation: function(req, res) {},
    UpdateConsultation: function(req, res) {},
    DestroyConsultation: function(req, res) {}
};
