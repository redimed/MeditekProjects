module.exports = {
    GetListEFormTemplate: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data == false) {
            res.serverError('data failed');
        } else {
            Services.GetListEFormTemplate(data, req.user)
                .then(function(eformTemplateRes) {
                    res.ok(eformTemplateRes);
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },

    GetHistoryByAppointment: function(req, res) {
        var data = req.body.data;
        Services.getHistoryDetail(data)
        .then(function(result) {
            res.ok(result);
        }, function(err) {
            res.serverError(ErrorWrap(err));
        })
    },
};
