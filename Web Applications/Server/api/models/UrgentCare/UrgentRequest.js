module.exports = {
    tableName: 'UrgentRequest',
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

        firstName: {
            type: 'string',
            columnName: 'FirstName'
        },

        lastName: {
            type: 'string',
            columnName: 'LastName'
        },

        phoneNumber: {
            type: 'string',
            columnName: 'PhoneNumber'
        },

        gender: {
            type: 'string',
            columnName: 'Gender' 
        },

        email: {
            type: 'string',
            columnName: 'Email'
        },

        DOB: {
            type: 'datetime',
            columnName: 'DOB'
        },

        address1: {
            type: 'datetime',
            columnName: 'Address1'
        },

        address2: {
            type: 'datetime',
            columnName: 'Address2'
        },

        suburb: {
            type: 'string',
            columnName: 'Suburb'
        },

        postCode: {
            type: 'string',
            columnName: 'PostCode'
        },

        state: {
            type: 'string',
            columnName: 'State'
        },

        IP: {
            type: 'string',
            columnName: 'IP'
        },

        requestDate: {
            type: 'datetime',
            columnName: 'RequestDate'
        },

        tried: {
            type: 'integer',
            columnName: 'Tried'
        },

        confirmed: {
            type: 'integer',
            columnName: 'Confirmed'
        },

        interval: {
            type: 'integer',
            columnName: 'Interval'
        },

        further: {
            type: 'string',
            columnName: 'Further'
        },

        description: {
            type: 'string',
            columnName: 'Description'
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

        MessageQueues:{
            collection: 'MessageQueue',
            via: 'urgentRequestID'
        }
    },

    beforeCreate: function(values, callback) {
            values.creationDate = new Date;
            callback();
        },

    beforeUpdate: function(values, callback){
            values.modifiedDate = new Date;
            callback();
        }
};