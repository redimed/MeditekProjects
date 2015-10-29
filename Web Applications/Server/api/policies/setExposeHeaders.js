//TODO
module.exports = function (req, res, next) {
    res.header('Access-Control-Expose-Headers', sails.config.cors.exposeHeaders);
    next();
};