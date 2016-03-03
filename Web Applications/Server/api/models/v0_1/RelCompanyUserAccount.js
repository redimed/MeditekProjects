module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        CompanyID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelCompanyUserAccount',
        timestamps: false,
        hooks: {}
    }
};
