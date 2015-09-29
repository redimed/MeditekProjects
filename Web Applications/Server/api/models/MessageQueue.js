module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        UrgentRequestID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'UrgentRequest',
                key: 'ID'
            }
        },
        Source: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        SourceID: {
            type: Sequelize.INTEGER(11),
            allowNull: true
        },
        Job: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Status: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        StartTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CompletedTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'MessageQueue',
        timestamps: false
    }
};
