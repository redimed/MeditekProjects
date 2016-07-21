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
        BillingGroupID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'BillingGroup',
                key: 'ID'
            }
        },
        BillingItemID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'BillingItem',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelBillingItemGroup',
        timestamps: false,
        hooks: {}
    }
};
