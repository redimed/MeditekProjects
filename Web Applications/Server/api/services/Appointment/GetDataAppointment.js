var moment = require('moment');
module.exports = {
    /*
    AppointmentCreate - services: get object to create new Appointment
    input: information Appointment
    output: object Appointment
    */
    AppointmentCreate: function(data) {
        return {
            SiteID: data.SiteID,
            RequestDate: data.RequestDate,
            Status: 'Waitting for Approval',
            Enable: 'Y'
        };
    },
    /*
    AppointmentUpdate - services: get object to update Appointment
    input: information Appointment
    output: object Appointment
    */
    AppointmentUpdate: function(data) {
        return {
            RequestDate: HelperService.CheckExistData(data.RequestDate) ? moment(data.RequestDate, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            FromTime: HelperService.CheckExistData(data.FromTime) ? moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            ToTime: HelperService.CheckExistData(data.ToTime) ? moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            ApprovalDate: HelperService.CheckExistData(data.ApprovalDate) ? moment(data.ApprovalDate, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            Status: data.Status
        };
    },
    /*
    TelehealthAppointmentCreate - services: get object to create Telehealth Appointment
    input: information Telehealth Appointment
    output: object Telehealth Appointment
    */
    TelehealthAppointmentCreate: function(data) {
        var FullName = HelperService.GetFullName(data.FirstName, data.MiddleName, data.LastName);
        return {
            RefName: FullName,
            RefHealthLink: data.HealthLink,
            RefAddress: data.Address,
            RefTelePhone: data.WorkPhoneNumber,
            RefPostcode: data.PostCode,
            RefSignature: data.Signature,
            RefDate: data.RefDate,
            RefProviderNumber: data.ProviderNumber,
            RefDurationOfReferal: data.RefDurationOfReferal,
            Correspondence: data.Correspondence,
            Enable: 'Y'
        };
    },
    /*
    TelehealthAppointmentUpdate - services: get object to update Telehealth Appointment
    input: information Telehealth Appointment
    output: object Telehealth Appointment
    */
    TelehealthAppointmentUpdate: function(data) {
        return {
            RefDurationOfReferal: data.RefDurationOfReferal,
            Correspondence: data.Correspondence,
            Fund: data.Fund,
            Allergy: data.Allergy,
            PresentComplain: data.PresentComplain
        };
    },
    /*
    PatientAppointmentCreate - services: get object to create PatientAppointment
    input: information PatientAppointment
    output: object PatientAppointment
    */
    PatientAppointmentCreate: function(data) {
        return {
            FirstName: data.FirstName,
            LastName: data.LastName,
            MiddleName: data.MiddleName,
            DOB: data.DOB,
            Address1: data.Address1,
            Address2: data.Address2,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            Email: data.Email,
            WorkPhoneNumber: data.WorkPhoneNumber,
            HomePhoneNumber: data.HomePhoneNumber
        };
    },
    /*
    PatientAppointmentUpdate - services: get object to update PatientAppointment
    input: information PatientAppointment
    output: object PatientAppointment
    */
    PatientAppointmentUpdate: function(data) {
        return {
            FirstName: data.FirstName,
            LastName: data.LastName,
            MiddleName: data.MiddleName,
            DOB: data.DOB,
            Address1: data.Address1,
            Address2: data.Address2,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            Email: data.Email,
            WorkPhoneNumber: data.WorkPhoneNumber,
            HomePhoneNumber: data.HomePhoneNumber
        };
    },
    /*
    ExaminationRequired - services: get object to create, update ExaminationRequired
    input: information ExaminationRequired
    output: object ExaminationRequired
    */
    ExaminationRequired: function(data) {
        return {
            Private: data.Private,
            Public: data.Public,
            DVA: data.DVA,
            WorkersComp: data.WorkersComp,
            MVIT: data.MVIT
        };
    },
    /*
    PreferredPractitioners - services: get object to create, update PreferredPractitioners
    input: information PreferredPractitioners
    output: object PreferredPractitioners
    */
    PreferredPractitioners: function(teleApptID, data) {
        data.forEach(function(value, index) {
            data[index].UID = UUIDService.Create();
            data[index].TelehealthAppointmentID = teleApptID;
        });
        return data;
    },
    /*
    ClinicalDetails - services: get object to create, update ClinicalDetails
    input: information ClinicalDetails
    output: object ClinicalDetails
    */
    ClinicalDetails: function(teleApptID, createdBy, data) {
        data.forEach(function(value, index) {
            data[index].UID = UUIDService.Create();
            data[index].TelehealthAppointmentID = teleApptID;
            data[index].CreatedBy = createdBy;
        });
        return data;
    }
};
