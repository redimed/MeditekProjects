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
        siteID: {
            type: Sequelize.BIGINT(20),
            field: 'SiteID'
        },
        userAccountID: {
            type: Sequelize.INTEGER,
            field: 'UserAccountID'
        },
        firstName: {
            type: Sequelize.STRING(50),
            field: 'FirstName'
        },
        middleName: {
            type: Sequelize.STRING(100),
            field: 'MiddleName'
        },
        lastName: {
            type: Sequelize.STRING(50),
            field: 'LastName'
        },
        dob: {
            type: Sequelize.DATE,
            field: 'Dob'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Email'
        },
        phone: {
            type: Sequelize.STRING(12),
            field: 'Phone'
        },
        enable: {
            type: Sequelize.STRING(1),
            field: 'Enable'
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
    associations: function() {
        Doctor.belongsTo(UserAccount, {
            foreignKey: 'userAccountID'
        });
    },
    options: {
        tableName: 'Doctor',
        timestamps: true,
        createdAt: 'creationDate',
        updatedAt: 'modifiedDate',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    },
};