module.exports = function(objAddItem) {
    var $q = require('q');
    var defer = $q.defer();
    var data = objAddItem.data;
    var userInfo = objAddItem.userInfo;
    // if (!_.isEmpty(data) &&
    //     !_.isEmpty(data.Items) &&
    //     _.isArray(data.Items)) {
    //     sequelize.transaction()
    //         .then(function(t) {
    //             sequelize.Promise.each(data.Items, function(item_v, item_i) {
    //                     //find item
    //                     return BillingItem.findOne({
    //                             attributes: {
    //                                 exclude: ['UID', 'Code', 'Description', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate']
    //                             },
    //                             where: {
    //                                 Code: item_v.ItemNum
    //                             },
    //                             transaction: t
    //                         })
    //                         .then(function(itemResult) {
    //                             if (itemResult) {
    //                                 //update item with type
    //                             } else {
    //                                 //create new item
    //                                 var itemCreate = {
    //                                     UID: UUIDService.Create(),
    //                                     Code: item_v.ItemNum,
    //                                     Description: item_v.Description
    //                                 };
    //                             }
    //                         }, function(err) {
    //                             defer.reject({ error: err });
    //                         })
    //                         .then(function(tableNames) {
    //                             console.log('tableNames', tableNames);
    //                         })
    //                 })
    //                 .then(function(dataAdded) {
    //                     defer.resolve({
    //                         data: dataAdded,
    //                         transaction: t
    //                     });
    //                 }, function(err) {
    //                     defer.reject({ error: err });
    //                 });
    //         }, function(err) {
    //             defer.reject({ error: err });
    //         });
    // } else {
    //     defer.reject({ error: 'AddItem.data.isEmpty' });
    // }
    defer.resolve('AddItem success');
    return defer.promise;
};
