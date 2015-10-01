module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        AppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Appointment',
                key: 'ID'
            }
        },
        Description: {
            type: Sequelize.TEXT
        },
        RefName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        RefHealthLink: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        RefAddress: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        RefTelePhone: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        RefPostCode: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        RefSignature: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        RefDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        RefProviderNumber: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        RefDurationOfReferal: {
            type: Sequelize.STRING(2),
            allowNull: true
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreationBy: {
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
        tableName: 'TelehealthAppointment',
        timestamps: false
    }
};
