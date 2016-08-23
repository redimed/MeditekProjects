module.exports = function(data, userInfo) {
    var $q = require('q');
    var defer = $q.defer();
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Items) &&
        _.isArray(data.Items) &&
        HelperService.CheckExistData(data.Name) &&
        HelperService.CheckExistData(data.Type)) {
        sequelize.transaction({ autocommit: false })
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
                    $q.all([Services.AddItemTemp(objAddItemTemp),
                            Services.AddItem(objAddItem)
                        ])
                        .then(function(successAll) {
                            defer.resolve({
                                data: {
                                    responseItem: successAll[1]
                                },
                                transaction: t
                            });
                        }, function(err) {
                            defer.reject({ error: err });
                        });
                },
                function(err) {
                    defer.reject({ error: err });
                });
    } else {
        defer.reject({ error: 'data.isEmpty' });
    }
    return defer.promise;
};
