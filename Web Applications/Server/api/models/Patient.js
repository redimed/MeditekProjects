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
            allowNull: true,
            references: {
                model: 'UserAccount',
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
        DOB: {
            type: Sequelize.DATE,
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
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Postcode: {
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
        tableName: 'Patient',
        timestamps: false
    }
};
