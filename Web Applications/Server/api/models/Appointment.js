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
            allowNull: false
        },
        SiteID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        DoctorID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Doctor',
                key: 'ID'
            }
        },
        PatientID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Patient',
                key: 'ID'
            }
        },
        FromTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ToTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Status: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        CreationDate: {
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
        tableName: 'Appointment',
        timestamps: false
    }
};
