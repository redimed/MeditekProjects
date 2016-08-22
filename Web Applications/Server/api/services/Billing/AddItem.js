module.exports = function(objAddItem) {
    var $q = require('q');
    var defer = $q.defer();
    var data = objAddItem.data;
    var userInfo = objAddItem.userInfo;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Items) &&
        _.isArray(data.Items)) {
        sequelize.Promise.each(data.Items, function(item_v, item_i) {
                //find item
                return BillingItem.findOne({
                        attributes: {
                            exclude: ['UID', 'Code', 'Description', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate']
                        },
                        where: {
                            Code: item_v.ItemNum
                        },
                        raw: true,
                        transaction: objAddItem.transaction
                    })
                    .then(function(itemResult) {
                        if (itemResult) {
                            //update item with type
                            var objGenerate = {
                                item: item_v,
                                dataOrigin: itemResult,
                                type: data.Type,
                                userInfo: userInfo
                            };
                            var dataUpdate = Services.GenerateItem.Update(objGenerate);
                            return BillingItem.update(dataUpdate, {
                                where: {
                                    ID: itemResult.ID
                                },
                                transaction: objAddItem.transaction
                            });
                        } else {
                            //create new item
                            var objGenerate = {
                                item: item_v,
                                type: data.Type,
                                userInfo: userInfo
                            };
                            var dataCreate = Services.GenerateItem.Create(objGenerate);
                            return BillingItem.create(dataCreate, {
                                transaction: objAddItem.transaction
                            });
                        }
                    }, function(err) {
                        defer.reject(err);
                    })
                    .then(function(billingCreatedorUpdated) {
                        return billingCreatedorUpdated;
                    }, function(err) {
                        defer.reject(err);
                    });
            })
            .then(function(dataAdded) {
                defer.resolve(dataAdded);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject(new Error('AddItem.data.isEmpty'));
    }
    return defer.promise;
};
