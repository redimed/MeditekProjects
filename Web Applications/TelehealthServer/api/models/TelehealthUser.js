module.exports = {
    attributes: {
        ID: {
            type: Sequelize.INTEGER,
            field: 'ID',
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: Sequelize.STRING,
            field: 'UID'
        },
        userAccountID: {
            type: Sequelize.INTEGER,
            field: 'UserAccountID'
        },
        firstName: {
            type: Sequelize.STRING,
            field: 'FirstName'
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'LastName'
        },
        dob: {
            type: Sequelize.DATE,
            field: 'DOB'
        },
        address1: {
            type: Sequelize.STRING,
            field: 'Address1',
        },
        address2: {
            type: Sequelize.STRING,
            field: 'Address2'
        },
        createdDate: {
            type: Sequelize.DATE,
            field: 'CreatedDate'
        },
        createdBy: {
            type: Sequelize.INTEGER,
            field: 'CreatedBy'
        },
        modifiedDate: {
            type: Sequelize.DATE,
            field: 'ModifiedDate'
        },
        modifiedBy: {
            type: Sequelize.INTEGER,
            field: 'ModifiedBy'
        }
    },
    associations: function() {
        TelehealthUser.belongsTo(UserAccount, {
            foreignKey: 'userAccountID'
        });
    },
    options: {
        tableName: 'TelehealthUser',
        timestamps: true,
        createdAt: 'createdDate',
        updatedAt: 'modifiedDate',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    }
};