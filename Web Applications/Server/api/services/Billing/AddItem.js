module.exports = function(objAddItem) {
    var $q = require('q');
    var defer = $q.defer();
    var data = objAddItem.data;
    var userInfo = objAddItem.userInfo;
    var rowsError = [];
    var currentItem = null;
    if (!_.isEmpty(data) &&
        !_.isEmpty(data.Items) &&
        _.isArray(data.Items)) {
        sequelize.Promise.each(data.Items, function(item_v, item_i) {
                currentItem = item_v;
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
                        currentItem.error = err;
                        rowsError.push(currentItem);
                    })
                    .then(function(billingCreatedorUpdated) {
                        return billingCreatedorUpdated;
                    }, function(err) {
                        currentItem.error = err;
                        rowsError.push(currentItem);
                    });
            })
            .then(function(dataAdded) {
                defer.resolve({ rowsError: rowsError });
            }, function(err) {
                defer.reject(err);
            });
    } else {
        error.pushError(new Error('AddItem.data.isEmpty'));
        defer.reject(error);
    }
    return defer.promise;
};
