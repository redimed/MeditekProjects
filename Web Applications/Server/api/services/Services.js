module.exports = {
    _: require('underscore'),
    UserAccount: require('./UserAccount/UserAccount'),
    Patient: require('./Patient/Patient'),
    UserActivation: require('./UserAccount/UserActivation'),
    CreateTelehealthAppointment: require('./Appointment/CreateTelehealthAppointment'),
    GetDataAppointment: require('./Appointment/GetDataAppointment'),
    GetListTelehealthAppointment: require('./Appointment/GetListTelehealthAppointment'),
    GetPaginationAppointment: require('./Appointment/GetPaginationAppointment'),
};
