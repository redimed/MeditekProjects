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
        AppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Appointment',
                key: 'ID'
            }
        },
        Description: {
            type: Sequelize.TEXT
        },
        Fund: {
            type: Sequelize.STRING(255),
            allowNull: true
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
        RefPostcode: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        RefSignature: {
            type: Sequelize.STRING(255),
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
        PresentComplain: {
            type: Sequelize.TEXT
        },
        Allergy: {
            type: Sequelize.TEXT
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        CreatedDate: {
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
        tableName: 'TelehealthAppointment',
        timestamps: false,
        hooks: {
            beforeCreate: function(telehealthAppt, options, callback) {
                telehealthAppt.CreationDate = new Date();
                callback();
            },
            beforeUpdate: function(telehealthAppt, options, callback) {
                telehealthAppt.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
