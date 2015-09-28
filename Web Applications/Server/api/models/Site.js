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
        SiteName: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        Location: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
        },
        Enable: {
            type: Sequelize.STRING(1),
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
        tableName: 'Site',
        timestamps: false
    }
};
