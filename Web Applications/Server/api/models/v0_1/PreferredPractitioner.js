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
            allowNull: true
        },
        TelehealthAppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
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
        tableName: 'PreferredPractitioner',
        timestamps: false
    }
};
