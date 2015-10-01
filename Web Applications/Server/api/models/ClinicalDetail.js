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
        ModuleID: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        SectionID: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        CategoryID: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Values: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
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
        tableName: 'ClinicalDetail',
        timestamps: false
    }
};
