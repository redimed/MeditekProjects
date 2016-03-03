module.exports = function(nameSetting, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    SystemSetting.findOne({
            attributes: Services.AttributesSystem.Setting(),
            where: {
                Name: nameSetting,
                Enable: 'Y',
                Active: 'Y'
            }
        })
        .then(function(eformTemplateList) {
            defer.resolve({ data: eformTemplateList });
        }, function(err) {
            defer.reject({
                error: err
            });
        });
    return defer.promise;
};
