module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
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
        tableName: 'RelGeneralPractitionerDoctor',
        timestamps: false
    }
};
