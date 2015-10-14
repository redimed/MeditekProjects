module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        TelehealthCallID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'TelehealthCall',
                key: 'ID'
            }
        },
        TelehealthUserID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'TelehealthUser',
                key: 'ID'
            }
        },
        Latitude: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Longitude: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Address: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        CreatedDate: {
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
        tableName: 'TelehealthCallUser',
        timestamps: false
    }
};
