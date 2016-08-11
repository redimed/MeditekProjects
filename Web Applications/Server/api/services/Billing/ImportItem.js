module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Items) &&
        _.isArray(data.Items) &&
        HelperService.CheckExistData(data.Name) &&
        HelperService.CheckExistData(data.Type)) {
        sequelize.transaction()
            .then(function(t) {
                var objAddItemTemp = {
                    data: data,
                    userInfo: userInfo,
                    transaction: t
                };
                var objAddItem = {
                    data: data,
                    userInfo: userInfo,
                    transaction: t
                };
                $q.all([Services.AddItemTemp(objAddItemTemp), Services.AddItem(objAddItem)])
                    .then(function(success) {
                        console.log('success');
                        defer.resolve(success);
                    }, function(err) {
                        defer.reject({ error: err });
                    });
            }, function(err) {
                defer.reject({ error: err });
            });
    } else {
        defer.reject({ error: 'data.isEmpty' });
    }
    return defer.promise;
};
