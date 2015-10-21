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
            allowNull: true,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        VerificationCode: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate:{
                len:[0,255]
            }
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate:{
                len:[0,45]  
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
        },

        TokenExpired:{
            type:Sequelize.INTEGER,
            allowNull:false
        },

        CodeExpired:{
            type:Sequelize.INTEGER,
            allowNull:false
        }
    },
    associations: function() {},
    options: {
        tableName: 'UserActivation',
        timestamps: false,
        hooks:{
            beforeCreate:function(item, options, cb)
            {
                 item.CreatedDate=new Date();
                 cb();
            }
        }
    },
};
