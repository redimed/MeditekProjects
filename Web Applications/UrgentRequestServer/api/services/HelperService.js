module.exports = {
    CheckExistData: function(data) {
        return (!_.isUndefined(data) && !_.isNull(data));
    }
};
