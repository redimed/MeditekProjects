module.exports = {
    tableName: 'UrgentRequest',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        ID: {
            type: 'integer',
            columnName: 'ID',
            maxLength: 20
        },

        UID: {
            type: 'string',
            columnName: 'UID',
            maxLength: 255,
            required: true
        },

        userAccountID: {
            type: 'integer',
            columnName: 'UserAccountID',
            maxLength: 20
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
            columnName: 'Tried',
            required: true,
            maxLength: 11
        },

        status: {
            type: 'string',
            columnName: 'Status',
            required: true,
            maxLength: 50
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
            columnName: 'ConfirmUserName',
            maxLength: 255
        },

        companyName: {
            type: 'string',
            columnName: 'CompanyName',
            maxLength: 255
        },

        companyPhoneNumber: {
            type: 'string',
            columnName: 'CompanyPhoneNumber',
            maxLength: 20
        },

        contactPerson: {
            type: 'string',
            columnName: 'ContactPerson',
            maxLength: 255
        },

        enable: {
            type: 'string',
            columnName: 'Enable'
        },

        description: {
            type: 'string',
            columnName: 'Description'
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

        MessageQueues: {
            collection: 'MessageQueue',
            via: 'urgentRequestID'
        }
    },

    beforeCreate: function(values, callback) {
        values.createdDate = new Date;
        callback();
    },

    beforeUpdate: function(values, callback) {
        values.modifiedDate = new Date;
        callback();
    }
};
