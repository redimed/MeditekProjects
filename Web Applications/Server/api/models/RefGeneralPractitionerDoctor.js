module.exports = {
    attributes: {
        GeneralPractitionerID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'GeneralPractitioner',
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
        tableName: 'RefGeneralPractitionerDoctor',
        timestamps: false
    }
};
