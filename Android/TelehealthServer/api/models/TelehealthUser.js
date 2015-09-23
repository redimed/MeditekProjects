module.exports = {
	tableName: 'TelehealthUser',
	autoCreatedAt: false,
	autoUpdatedAt: false,
    attributes: {
        ID: {
			type: 'integer',
			columnName: 'ID'
		},
		UID: {
			type: 'string',
			columnName: 'UID'
		},
		userAccountID: {
			type: 'integer',
			columnName: 'UserAccountID'
		},
		firstName: {
			type: 'string',
			columnName: 'FirstName'
		},
		lastName: {
			type: 'string',
			columnName: 'LastName'
		},
		dob: {
			type: 'datetime',
			columnName: 'DOB'
		},
		address1: {
			type: 'string',
			columnName: 'Address1',
		},
		address2: {
			type: 'string',
			columnName: 'Address2'
		},
		creationDate: {
            type: 'datetime',
            columnName: 'CreationDate'
        },
        createdBy: {
            type: 'integer',
            columnName: 'CreatedBy'
        },
        modifiedDate: {
            type: 'datetime',
            columnName: 'ModifiedDate'
        },
        modifiedBy: {
            type: 'integer',
            columnName: 'ModifiedBy'
        }
    },

    beforeCreate: function(values, callback){
        	values.creationDate = new Date();
        	callback();
        },

    beforeUpdate: function(values, callback){
        	values.modifiedDate = new Date();
        	callback();
        } 
};