module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        Suburb: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        State: {
            type: Sequelize.STRING(4),
            allowNull: false
        },
        DC: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: false
        },
        Lat: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        Lon: {
            type: Sequelize.DOUBLE,
            allowNull: false
        }
    },
    associations: function() {},
    options: {
        tableName: 'PostCode',
        timestamps: false
    }
};
