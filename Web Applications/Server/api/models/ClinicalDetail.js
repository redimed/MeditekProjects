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
        TelehealthAppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'TelehealthAppointment',
                key: 'ID'
            }
        },
        Section: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Category: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Value: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        ClinicalNote: {
            type: Sequelize.TEXT
        },
        Description: {
            type: Sequelize.TEXT
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
        tableName: 'ClinicalDetail',
        timestamps: false,
        hooks: {
            beforeCreate: function(clinicalDetail, options, callback) {
                clinicalDetail.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(clinicalDetails, options, callback) {
                clinicalDetails.forEach(function(value, index) {
                    clinicalDetails[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeUpdate: function(appt, options, callback) {
                clinicalDetail.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
