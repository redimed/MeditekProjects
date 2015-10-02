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
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        LastName: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        DOB: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Address: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        PhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
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
        tableName: 'PatientAppointment',
        timestamps: false
    }
};