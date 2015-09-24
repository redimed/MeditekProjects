module.exports = {
	attributes:{
		ID: {type: Sequelize.BIGINT(20), field: 'ID', primaryKey: true, autoIncrement: true},
		userAccountID: {type: Sequelize.BIGINT(20), field: 'UserAccountID'},
		verificationCode: {type: Sequelize.STRING, field: 'VerificationCode'},
		type: {type: Sequelize.STRING, field: 'Type'},
		verificationToken: {type: Sequelize.STRING, field: 'VerificationToken'},
		deviceToken: {type: Sequelize.TEXT, field: 'DeviceToken'},
		creationDate: {type: Sequelize.DATE, field: 'CreationDate'},
        createdBy: {type: Sequelize.BIGINT(20), field: 'CreatedBy' },
        modifiedDate: {type: Sequelize.DATE, field: 'ModifiedDate'},
        modifiedBy: {type: Sequelize.BIGINT(20), field: 'ModifiedBy'}
	},
    options: {
	    tableName: 'UserActivation',
	    timestamps: true,
	    createdAt: 'creationDate',
	    updatedAt: 'modifiedDate',
	    classMethods: {},
	    instanceMethods: {},
	    hooks: {}
  	},
};