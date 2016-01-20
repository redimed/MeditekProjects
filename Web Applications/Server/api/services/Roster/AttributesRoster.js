module.exports = {
    Roster: function() {
        return ['UID', 'FromTime', 'ToTime', 'isRecurrence', 'RecurrenceType', 'EndRecurrence'];
    },
    UserAccount: function() {
        return ['ID', 'UID', 'UserName', 'Email', 'PhoneNumber', 'Activated', 'Enable'];
    },
    Service: function() {
    	return ['UID', 'ServiceName'];
    }
};
