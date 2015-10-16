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
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        DepartmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Department',
                key: 'ID'
            }
        },
        Title: {
            type: Sequelize.STRING(45),
            allowNull: true
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
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Type: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        DOB: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Address1: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Address2: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        State: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        CountryID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Country',
                key: 'ID'
            }
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        WorkPhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Signature: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'FileUpload',
                key: 'ID'
            }
        },
        HealthLink: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        ProviderNumber: {
            type: Sequelize.STRING(255),
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
        tableName: 'Doctor',
        timestamps: false
    }
};
