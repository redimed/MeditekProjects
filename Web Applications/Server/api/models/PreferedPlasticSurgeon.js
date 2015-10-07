module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        TelehealthAppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'TelehealthAppointment',
                key: 'ID'
            }
        },
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'PreferedPlasticSurgeon',
        timestamps: false,
        hooks: {
            beforeCreate: function(refPlasSurgon, options, callback) {
                refPlasSurgon.CreationDate = new Date();
                callback();
            },
            beforeUpdate: function(refPlasSurgon, options, callback) {
                refPlasSurgon.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
