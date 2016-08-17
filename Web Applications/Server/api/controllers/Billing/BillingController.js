module.exports = {
    CreateBilling: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
    },
    ReadBilling: function(req, res) {},
    UpdateBilling: function(req, res) {},
    DestroyBilling: function(req, res) {},
    AddItem: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            return res.badRequest("data failed");
        } else {
            Services.ImportItem(data, req.user)
                .then(function(success) {
                    success.transaction.commit()
                        .then(function(commitSuccess) {
                            res.ok(success.data);
                        }, function(err) {
                            res.serverError(err);
                        });
                }, function(err) {
                    success.transaction.rollback()
                        .then(function(commitSuccess) {
                            res.serverError(err.error);
                        }, function(err) {
                            res.serverError(err);
                        });
                    success.transaction.rollback();
                });
        }
    }
};
