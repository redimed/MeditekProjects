module.exports = {
    attributes: {
        ID: {
            type: Sequelize.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        RosterID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Roster',
                key: 'ID'
            }
        },
        ServiceID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Service',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelRosterService',
        timestamps: false,
        hooks: {}
    }
};
