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
			columnName: 'UID',
			required: true,
			maxLength: 255
		},
		urgentRequestID: {
			type: 'integer',
			columnName: 'UrgentRequestID',
			required: true
		},
		source: {
			type: 'string',
			columnName: 'Source',
			required: true,
			maxLength: 100
		},
		sourceID: {
			type: 'string',
			columnName: 'SourceID',
			required: true
		},
		job: {
			type: 'string',
			columnName: 'Job',
			maxLength: 100,
		},
		status: {
			type: 'string',
			columnName: 'Status',
			required: true,
			maxLength: 100

		},
		startTime: {
			type: 'datetime',
			columnName: 'StartTime'
		},
		completedTime: {
			type: 'datetime',
			columnName: 'CompletedTime'
		},
		createdDate: {
            type: 'datetime',
            columnName: 'CreatedDate'
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