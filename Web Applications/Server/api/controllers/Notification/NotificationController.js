module.exports = {
    CreatePrivateNotify: function(req, res) {
        var body = req.body;
        if (body.data) {
            req.dmObj = body.data;
            res.ok('success');
        } else {
            error.pushError('data.null');
            throw error;
        };
    },

    CreateGlobalNotify: function(req, res) {
        var body = req.body;
        if (body.data) {
            req.dmObj = body.data;
            res.ok('success');
        } else {
            error.pushError('data.null');
            throw error;
        };
    }
}
