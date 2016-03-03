module.exports = {
    GetValueSetting: function(req, res) {
        var name = req.param('name');
        Services.GetValueSetting(name, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                res.serverError(ErrorWrap(err.error || err));
            });
    }
};
