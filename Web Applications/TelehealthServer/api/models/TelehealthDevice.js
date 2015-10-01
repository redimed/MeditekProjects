module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: Sequelize.STRING,
            field: 'UID'
        },
        telehealthUserID: {
            type: Sequelize.BIGINT(20),
            field: 'TelehealthUserID'
        },
        deviceToken: {
            type: Sequelize.TEXT,
            field: 'DeviceToken'
        },
        deviceId: {
            type: Sequelize.TEXT,
            field: 'DeviceID'
        },
        type: {
            type: Sequelize.STRING,
            field: 'Type'
        },
        creationDate: {
            type: Sequelize.DATE,
            field: 'CreationDate'
        },
        createdBy: {
            type: Sequelize.BIGINT(20),
            field: 'CreatedBy'
        },
        modifiedDate: {
            type: Sequelize.DATE,
            field: 'ModifiedDate'
        },
        modifiedBy: {
            type: Sequelize.BIGINT(20),
            field: 'ModifiedBy'
        }
    },
    options: {
        tableName: 'TelehealthDevice',
        timestamps: true,
        createdAt: 'creationDate',
        updatedAt: 'modifiedDate',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    },
};