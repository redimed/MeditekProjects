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
            allowNull: true,
            references: {
                model: 'Doctor',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelTelehealthAppointmentDoctor',
        timestamps: false
    }
};
