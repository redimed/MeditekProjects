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
            columnName: 'UID',
            required: true
        },

        userAccountID: {
            type: 'integer',
            columnName: 'UserAccountID'
        },

        firstName: {
            type: 'string',
            columnName: 'FirstName',
            required: true,
            maxLength: 50
        },

        lastName: {
            type: 'string',
            columnName: 'LastName',
            required: true,
            maxLength: 255
        },

        phoneNumber: {
            type: 'string',
            columnName: 'PhoneNumber',
            required: true,
            maxLength: 20
        },

        gender: {
            type: 'string',
            columnName: 'Gender',
            maxLength: 100
        },

        email: {
            type: 'email',
            columnName: 'Email',
            maxLength: 255
        },

        DOB: {
            type: 'datetime',
            columnName: 'DOB'
        },
        suburb: {
            type: 'string',
            columnName: 'Suburb',
            maxLength: 100
        },

        IP: {
            type: 'string',
            columnName: 'IP',
            maxLength: 255
        },

        GPReferal: {
            type: 'string',
            columnName: 'GPReferal',
            maxLength: 1
        },

        serviceType: {
            type: 'string',
            columnName: 'ServiceType',
            maxLength: 3
        },

        requestDate: {
            type: 'datetime',
            columnName: 'RequestDate'
        },

        tried: {
            type: 'integer',
            columnName: 'Tried'
        },

        status: {
            type: 'string',
            columnName: 'Status'
        },

        interval: {
            type: 'integer',
            columnName: 'Interval'
        },

        further: {
            type: 'string',
            columnName: 'Further'
        },

        urgentRequestType: {
            type: 'string',
            columnName: 'UrgentRequestType'
        },

        confirmUserName: {
            type: 'string',
            columnName: 'ConfirmUserName'
        },

        enable: {
            type: 'string',
            columnName: 'Enable'
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

        MessageQueues: {
            collection: 'MessageQueue',
            via: 'urgentRequestID'
        }
    },

    beforeCreate: function(values, callback) {
        values.creationDate = new Date;
        callback();
    },

    beforeUpdate: function(values, callback) {
        values.modifiedDate = new Date;
        callback();
    }
};
