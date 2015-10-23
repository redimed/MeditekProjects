var moment = require('moment');
module.exports = {
    AppointmentCreate: function(data) {
        return {
            SiteID: data.SiteID,
            RequestDate: data.RequestDate,
            Status: 'Watting for approval',
            Enable: 'Y'
        };
    },
    AppointmentUpdate: function(data) {
        return {
            RequestDate: HelperService.CheckExistData(data.RequestDate) ? moment(data.RequestDate, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            FromTime: HelperService.CheckExistData(data.FromTime) ? moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            ToTime: HelperService.CheckExistData(data.ToTime) ? moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            ApprovalDate: HelperService.CheckExistData(data.ApprovalDate) ? moment(data.ApprovalDate, 'YYYY-MM-DD HH:mm:ss Z').toDate() : null,
            Status: data.Status
        };
    },
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
    TelehealthAppointmentUpdate: function(data) {
        return {
            RefDurationOfReferal: data.RefDurationOfReferal,
            Correspondence: data.Correspondence,
            Fund: data.Fund,
            Allergy: data.Allergy,
            PresentComplain: data.PresentComplain
        };
    },
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
    ExaminationRequired: function(data) {
        return {
            Private: data.Private,
            Public: data.Public,
            DVA: data.DVA,
            WorkersComp: data.WorkersComp,
            MVIT: data.MVIT
        };
    },
    PreferredPractitioners: function(teleApptID, data) {
        data.forEach(function(value, index) {
            data[index].UID = UUIDService.Create();
            data[index].TelehealthAppointmentID = teleApptID;
        });
        return data;
    },
    ClinicalDetails: function(teleApptID, createdBy, data) {
        data.forEach(function(value, index) {
            data[index].UID = UUIDService.Create();
            data[index].TelehealthAppointmentID = teleApptID;
            data[index].CreatedBy = createdBy;
        });
        return data;
    },
    PatientCreate: function(data) {
        return {
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            DOB: data.DOB,
            Address: data.Address,
            Suburb: data.Suburb,
            PostCode: data.PostCode,
            HomePhoneNumber: data.HomePhoneNumber,
            Email: data.Email
        };
    },
    DoctorCreate: function(data) {
        return {
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            Phone: data.Phone,
            DepartmentID: data.DepartmentID
        };
    }
};
