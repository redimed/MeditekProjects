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
            allowNull: true,
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
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
            type: Sequelize.DATE,
            allowNull: true
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Address: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Phone: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Signture: {
            type: Sequelize.STRING(255),
            allowNull: true
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
