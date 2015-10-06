module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        DoctorID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Doctor',
                key: 'ID'
            }
        },
        AppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Appointment',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelDoctorAppointment',
        timestamps: false
    }
};