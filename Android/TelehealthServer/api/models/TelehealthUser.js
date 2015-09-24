module.exports = {
    attributes: {
        ID: {
			type: Sequelize.INTEGER,
			field: 'ID',
			primaryKey: true, 
			autoIncrement: true
		},
		UID: {
			type: Sequelize.STRING,
			field: 'UID'
		},
		userAccountID: {
			type: Sequelize.INTEGER,
			field: 'UserAccountID'
		},
		firstName: {
			type: Sequelize.STRING,
			field: 'FirstName'
		},
		lastName: {
			type: Sequelize.STRING,
			field: 'LastName'
		},
		dob: {
			type: Sequelize.DATE,
			field: 'DOB'
		},
		address1: {
			type: Sequelize.STRING,
			field: 'Address1',
		},
		address2: {
			type: Sequelize.STRING,
			field: 'Address2'
		},
		creationDate: {
            type: Sequelize.DATE,
            field: 'CreationDate'
        },
        createdBy: {
            type: Sequelize.INTEGER,
            field: 'CreatedBy'
        },
        modifiedDate: {
            type: Sequelize.DATE,
            field: 'ModifiedDate'
        },
        modifiedBy: {
            type: Sequelize.INTEGER,
            field: 'ModifiedBy'
        }
    },
    options: {
	    tableName: 'TelehealthUser',
	    timestamps: true,
	    createdAt: 'creationDate',
	    updatedAt: 'modifiedDate',
	    classMethods: {},
	    instanceMethods: {},
	    hooks: {}
  	}
};