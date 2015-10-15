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
        AppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Appointment',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelTelehealthCallAppointment',
        timestamps: false
    }
};
