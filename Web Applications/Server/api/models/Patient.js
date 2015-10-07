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
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate:{
                len:[0,50]
            }
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate:{
                len:[0,100]
            }
        },
        LastName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,50]
            }
        },
        DOB: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Address: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,255]
            }
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate:{
                len:[0,100]
            }
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate:{
                len:[0,100]
            }
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,100]
            }
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate:{
                len:[0,20]
            }
        },
        CountryID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Country',
                key: 'ID'
            }
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
