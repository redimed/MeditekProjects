module.exports = function(objAddItemTemp) {
    var $q = require('q');
    var defer = $q.defer();
    var currentModel = null;
    var data = objAddItemTemp.data;
    var userInfo = objAddItemTemp.userInfo;
    if (!_.isEmpty(data) &&
        HelperService.CheckExistData(data.Name) &&
        HelperService.CheckExistData(data.Type)) {
        var queryInterface = sequelize.getQueryInterface();
        var objCreateTable = {
            ID: {
                type: Sequelize.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            UID: {
                type: Sequelize.STRING,
                unique: true
            },
            CreatedDate: {
                type: Sequelize.DATE
            },
            CreatedBy: {
                type: Sequelize.BIGINT
            },
            ModifiedDate: {
                type: Sequelize.DATE
            },
            ModifiedBy: {
                type: Sequelize.BIGINT
            }
        };
        //loop data items
        _.forEach(data.Items, function(item, index) {
            if (!_.isEmpty(item)) {
                //loop item
                _.forEach(item, function(item_v, item_i) {
                    var isFound = false;
                    //loop objCreateTable
                    _.forEach(objCreateTable, function(column, index) {
                        if (index == item_i) {
                            isFound = true;
                        }
                    });
                    if (isFound == false) {
                        objCreateTable[item_i] = {
                            type: Sequelize.TEXT
                        };
                    }
                });
            }
        });
        //create if not exist table
        queryInterface.createTable(data.Name, objCreateTable, {
                engine: 'InnoDB',
                charset: 'latin1'
            })
            .then(function(tableCreated) {
                //insert data to table
                return sequelize.define(data.Name, objCreateTable, {
                    tableName: data.Name,
                    timestamps: false
                });
            }, function(err) {
                defer.reject(err);
            })
            .then(function(modelCreated) {
                currentModel = modelCreated;
                return currentModel.findOne({
                    attributes: ['*'],
                    limit: 1,
                    raw: true
                });
            }, function(err) {
                defer.reject(err);
            })
            .then(function(resultItem) {
                if (resultItem) {
                    var arrColumnAdd = [];
                    _.forEach(objCreateTable, function(columnCreate, indexCreate) {
                        var isFound = false;
                        _.forEach(resultItem, function(columnExist, indexExist) {
                            if (indexCreate == indexExist) {
                                isFound = true;
                            }
                        });
                        if (!isFound) {
                            arrColumnAdd.push(indexCreate);
                        }
                    });
                    if (!_.isEmpty(arrColumnAdd)) {
                        return sequelize.Promise.each(arrColumnAdd, function(columnName, indexColumn) {
                            return queryInterface.addColumn(data.Name, columnName, Sequelize.TEXT);
                        });
                    }
                }

            }, function(err) {
                defer.reject(err);
            })
            .then(function(tableUpdated) {
                var items = data.Items;
                _.forEach(items, function(item, index) {
                    items[index].UID = UUIDService.Create();
                    items[index].CreatedDate = new Date();
                    items[index].CreatedBy = userInfo ? userInfo.ID : null;
                });
                return currentModel.bulkCreate(items);
            }, function(err) {
                defer.reject(err);
            })
            .then(function(itemCreated) {
                defer.resolve(itemCreated);
            }, function(err) {
                defer.reject(err);
            });
    } else {
        defer.reject('data.isEmpty');
    }
    return defer.promise;
};
