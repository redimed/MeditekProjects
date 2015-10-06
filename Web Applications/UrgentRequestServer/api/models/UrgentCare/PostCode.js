module.exports = {
    tableName: 'PostCode',
    autoCreatedAt: false,
    autoUpdatedAt: false,
    attributes: {
        ID: {
            type: 'string',
            columnName: 'ID'
        },
        PostCode: {
            type: 'integer',
            columnName: 'PostCode',
            maxLength: 100
        },
        Suburb: {
            type: 'string',
            columnName: 'Suburb',
            maxLength: 45
        },
        State: {
            type: 'string',
            columnName: 'State',
            maxLength: 4
        },
        DC: {
            type: 'string',
            columnName: 'DC',
            maxLength: 45
        },
        Type: {
            type: 'string',
            columnName: 'Type',
            maxLength: 45
        },
        Lat: {
            type: 'double',
            columnName: 'Lat'
        },
        Lon: {
            type: 'double',
            columnName: 'Lon'
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
