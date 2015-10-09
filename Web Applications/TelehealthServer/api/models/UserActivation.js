module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        userAccountID: {
            type: Sequelize.BIGINT(20),
            field: 'UserAccountID'
        },
        verificationCode: {
            type: Sequelize.STRING,
            field: 'VerificationCode'
        },
        type: {
            type: Sequelize.STRING,
            field: 'Type'
        },
        verificationToken: {
            type: Sequelize.STRING,
            field: 'VerificationToken'
        },
        deviceID: {
            type: Sequelize.TEXT,
            field: 'DeviceID'
        },
        createdDate: {
            type: Sequelize.DATE,
            field: 'CreatedDate'
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
        tableName: 'UserActivation',
        timestamps: true,
        createdAt: 'createdDate',
        updatedAt: 'modifiedDate',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    },
};