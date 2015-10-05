module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        CountryName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
        },
        Enable: {
            type: Sequelize.STRING(1),
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
        tableName: 'Country',
        timestamps: false
    }
};
