module.exports = {
	tableName: 'MessageQueue',
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
		urgentRequestID: {
			type: 'integer',
			columnName: 'UrgentRequestID'
		},
		source: {
			type: 'string',
			columnName: 'Source'
		},
		sourceID: {
			type: 'string',
			columnName: 'SourceID'
		},
		job: {
			type: 'string',
			columnName: 'Job'
		},
		status: {
			type: 'string',
			columnName: 'Status',
		},
		startTime: {
			type: 'datetime',
			columnName: 'StartTime'
		},
		completedTime: {
			type: 'datetime',
			columnName: 'CompletedTime'
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
        },

        urgentRequestID:{
            model:'UrgentRequest'
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