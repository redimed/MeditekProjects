module.exports = {
    GetListLanguage: function(req, res) {
        Services.GetListLanguage()
            .then(function(listState) {
                res.ok(listState);
            }, function(err) {
                res.serverError(err.error);
            });
    }
}
