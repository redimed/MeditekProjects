module.exports = {
    UserAccount: require('./UserAccount/UserAccount'),
    Patient: require('./Patient/Patient'),
    UserActivation: require('./UserAccount/UserActivation'),
    //Telehealth Appointment
    CreateTelehealthAppointment: require('./Appointment/CreateTelehealthAppointment'),
    GetDataAppointment: require('./Appointment/GetDataAppointment'),
    GetListTelehealthAppointment: require('./Appointment/GetListTelehealthAppointment'),
    GetPaginationAppointment: require('./Appointment/GetPaginationAppointment'),
    GetDetailTelehealthAppointment: require('./Appointment/GetDetailTelehealthAppointment'),
    UpdateTelehealthAppointment: require('./Appointment/UpdateTelehealthAppointment'),
    UrgentCare: require('./UrgentCare/UrgentCare'),
    DeleteTelehealthAppointment: require('./Appointment/DeleteTelehealthAppointment'),
    Module:require('./Authorization/v0_1/Module'),
    Doctor:require('./Doctor/Doctor')
};
