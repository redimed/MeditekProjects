module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        VerificationCode: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,2]
            }
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate:{
                len:[0,45],
                equals:'11'
            }
        },
        VerificationToken: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,255]
            }
        },
        DeviceID: {
            type: Sequelize.TEXT
        },
        CreationDate: {
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
        tableName: 'UserActivation',
        timestamps: false
    }
};
