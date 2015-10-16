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
        userName: {
            type: Sequelize.STRING,
            field: 'UserName'
        },
        email: {
            type: Sequelize.STRING,
            field: 'Email'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'PhoneNumber'
        },
        password: {
            type: Sequelize.STRING,
            field: 'Password'
        },
        passwordSalt: {
            type: Sequelize.STRING,
            field: 'PasswordSalt'
        },
        passwordHashAlgorithm: {
            type: Sequelize.STRING,
            field: 'PasswordHashAlgorithm'
        },
        activated: {
            type: Sequelize.STRING,
            field: 'Activated'
        },
        enable: {
            type: Sequelize.STRING,
            field: 'Enable'
        },
        userType: {
            type: Sequelize.STRING,
            field: 'UserType'
        },
        token: {
            type: Sequelize.STRING,
            field: 'Token'
        },
        tokenExpired: {
            type: Sequelize.STRING,
            field: 'TokenExpired'
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
    associations: function() {
        UserAccount.hasOne(TelehealthUser, {
            foreignKey: 'userAccountID'
        });
        UserAccount.hasOne(Doctor, {
            foreignKey: 'userAccountID'
        });
        UserAccount.hasOne(Patient, {
            foreignKey: 'UserAccountID'
        });
    },
    options: {
        tableName: 'UserAccount',
        timestamps: true,
        createdAt: 'createdDate',
        updatedAt: 'modifiedDate',
        classMethods: {},
        instanceMethods: {},
        hooks: {}
    },
};