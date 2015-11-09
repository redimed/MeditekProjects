module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        SystemType: {
            type: Sequelize.STRING
        },
        DeviceID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        SecretKey: {
            type: Sequelize.STRING
        },
        SecretCreatedDate: {
            type: Sequelize.DATE
        },
        TokenExpired: {
            type: Sequelize.BIGINT(20)
        },
        Enable: {
            type: Sequelize.STRING
        }
    },
    associations: function() {},
    options: {
        tableName: 'UserToken',
        timestamps: false,
        hooks: {
            beforeCreate: function(usetoken, options, callback) {
                usetoken.SecretCreatedDate = new Date();
                callback();
            }
        }
    }
};