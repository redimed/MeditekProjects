module.exports={
	attributes:{
		id:{
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

		fileName:{
			type:Sequelize.STRING(200),
			allowNull:false,
			validate:{
				len:{
					args:[0,200],
					msg:'To long!'
				}
			}
		},

		isFolder:{
			type:Sequelize.INTEGER(11),
			allowNull:false,
			validate:{
				isInt:{
					msg:'Must be an integer'
				}
			}
		},

		parent:{
			type:Sequelize.INTEGER(11),
			allowNull:false,
			validate:{
				isInt:{
					msg:'Must be an integer'
				}
			}
		},

		fileUrl:{
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
		tableName:'drawing_template',
		timestamps:false,
	}
}