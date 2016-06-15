module.exports = {
    Roster: function() {
        return ['UID', 'FromTime', 'ToTime', 'IsRecurrence', 'RecurrenceType', 'EndRecurrence'];
    },
    UserAccount: function() {
        return ['ID', 'UID', 'UserName', 'Email', 'PhoneNumber', 'Activated', 'Enable'];
    },
    Service: function() {
        return ['ID', 'UID', 'ServiceName', 'Description', 'Colour', 'Referral', 'Bookable'];
    },
    Site: function() {
        return ['ID', 'UID', 'SiteName', 'Address', 'PhoneNumber',
            'FaxNumber', 'Email', 'Location', 'Description'
        ];
    }
};
