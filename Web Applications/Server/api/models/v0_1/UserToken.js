module.exports={
	attributes:{
		ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },

		SystemType: {
            type: Sequelize.STRING(45),
            allowNull: true,
            comment: 'IOS: IOS; Website: WEB; Android: ARD',
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },

        DeviceID: {
            type: Sequelize.TEXT,
            validate: {

                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
                }
            }
        },

        SecretKey:{
        	type:Sequelize.STRING(255),
        },

        SecretCreatedDate:{
        	type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },

        TokenExpired:{
        	type:Sequelize.INTEGER(11),
        },

        Enable:{
        	type:Sequelize.STRING(1),
        	defaultValue:'Y',
        }
	},

    associations: function() {},
    options: {
        tableName: 'UserToken',
        timestamps: false,
    }
}