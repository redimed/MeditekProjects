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
            allowNull: true
        },
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        LastName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        PhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        Gender: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        DOB: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Ip: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        GPReferal: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        // ServiceType: {
        //     type: Sequelize.STRING(3),
        //     allowNull: true
        // },
        RequestType: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        RequestDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Tried: {
            type: Sequelize.INTEGER(11),
            allowNull: true
        },
        Interval: {
            type: Sequelize.INTEGER(11),
            allowNull: true
        },
        Further: {
            type: Sequelize.TEXT
        },
        UrgentRequestType: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        ConfirmUserName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        CompanyName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        CompanyPhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        ContactPerson: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        Status: {
            type: Sequelize.STRING(50),
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
        tableName: 'UrgentRequest',
        timestamps: false
    }
};
