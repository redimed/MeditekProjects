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
        DoctorID: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        HealthLink: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        ProviderNumber: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'GeneralPractitioner',
        timestamps: false
    }
};
