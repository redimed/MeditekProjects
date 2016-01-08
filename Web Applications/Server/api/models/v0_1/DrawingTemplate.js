module.exports={
	attributes:{
		ID:{
			type:Sequelize.INTEGER(11),
			primaryKey:true,
			autoIncrement:true,
			allowNull:false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
		},

		FileName:{
			type:Sequelize.STRING(200),
			allowNull:false,
			validate:{
				len:{
					args:[0,200],
					msg:'To long!'
				}
			}
		},

		IsFolder:{
			type:Sequelize.INTEGER(11),
			allowNull:false,
			validate:{
				isInt:{
					msg:'Must be an integer'
				}
			}
		},

		Parent:{
			type:Sequelize.INTEGER(11),
			allowNull:false,
			validate:{
				isInt:{
					msg:'Must be an integer'
				}
			}
		},

		FileUrl:{
			type: Sequelize.TEXT,
            validate: {
                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
                }
            }
		},
	},

	options:{
		tableName:'DrawingTemplate',
		timestamps:false,
	}
}