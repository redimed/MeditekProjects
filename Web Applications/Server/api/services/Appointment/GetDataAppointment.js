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
            Status: 'Received',
            Type: data.Type,
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
            RefAddress1: data.Address1,
            RefAddress2: data.Address2,
            RefTelePhone: data.WorkPhoneNumber,
            RefPostcode: data.PostCode,
            RefSignature: data.Signature,
            RefDate: data.RefDate,
            RefProviderNumber: data.ProviderNumber,
            RefDurationOfReferral: data.RefDurationOfReferral,
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
            RefDurationOfReferral: data.RefDurationOfReferral,
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
            Title: data.Title,
            MaritalStatus: data.MaritalStatus,
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            PreferredName: data.PreferredName,
            PreviousName: data.PreviousName,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            State: data.State,
            CountryOfBirth: data.CountryOfBirth,
            DOB: data.DOB,
            Gender: data.Gender,
            Indigenous: data.Indigenous,
            Address1: data.Address1,
            Address2: data.Address2,
            Email1: data.Email1,
            Email2: data.Email2,
            PhoneNumber: data.PhoneNumber,
            HomePhoneNumber: data.HomePhoneNumber,
            WorkPhoneNumber: data.WorkPhoneNumber,
            FaxNumber: data.FaxNumber,
            InterpreterRequired: data.InterpreterRequired,
            InterpreterLanguage: data.InterpreterLanguage,
            OtherSpecialNeed: data.OtherSpecialNeed,
            MedicareNumber: data.MedicareNumber,
            MedicareReferenceNumber: data.MedicareReferenceNumber,
            ExpiryDate: data.ExpiryDate,
            DVANumber: data.DVANumber,
            PatientKinName: data.PatientKinName,
            PatientKinRelationship: data.PatientKinRelationship,
            PatientKinContactNumber: data.PatientKinContactNumber
        };
    },
    /*
    PatientAppointmentUpdate - services: get object to update PatientAppointment
    input: information PatientAppointment
    output: object PatientAppointment
    */
    PatientAppointmentUpdate: function(data) {
        return {
            Title: data.Title,
            MaritalStatus: data.MaritalStatus,
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            PreferredName: data.PreferredName,
            PreviousName: data.PreviousName,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            State: data.State,
            CountryOfBirth: data.CountryOfBirth,
            DOB: data.DOB,
            Gender: data.Gender,
            Indigenous: data.Indigenous,
            Address1: data.Address1,
            Address2: data.Address2,
            Email1: data.Email1,
            Email2: data.Email2,
            PhoneNumber: data.PhoneNumber,
            HomePhoneNumber: data.HomePhoneNumber,
            WorkPhoneNumber: data.WorkPhoneNumber,
            FaxNumber: data.FaxNumber,
            InterpreterRequired: data.InterpreterRequired,
            InterpreterLanguage: data.InterpreterLanguage,
            OtherSpecialNeed: data.OtherSpecialNeed,
            MedicareEligible: data.MedicareEligible,
            MedicareNumber: data.MedicareNumber,
            MedicareReferenceNumber: data.MedicareReferenceNumber,
            ExpiryDate: data.ExpiryDate,
            DVANumber: data.DVANumber,
            PatientKinName: data.PatientKinName,
            PatientKinRelationship: data.PatientKinRelationship,
            PatientKinContactNumber: data.PatientKinContactNumber
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
    TelePreferredPractitioners - services: get object to create, update PreferredPractitioners
    input: information PreferredPractitioners
    output: object PreferredPractitioners
    */
    TelePreferredPractitioners: function(teleApptID, data) {
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
    },
    AddDataPreferredPractitioner: function(preferredPractitioner, data) {
        preferredPractitioner.Doctor.IsUsualGP = data.IsUsualGP;
        preferredPractitioner.Doctor.UsualGPName = data.UsualGPName;
        preferredPractitioner.Doctor.UsualGPContactNumber = data.UsualGPContactNumber;
        preferredPractitioner.Doctor.UsualGPFaxNumber = data.UsualGPFaxNumber;
        preferredPractitioner.Doctor.IsSamePlacePreference = data.IsSamePlacePreference;
        preferredPractitioner.Doctor.IsTelehealthSuitable = data.IsTelehealthSuitable;
        preferredPractitioner.Doctor.LengthOfReferal = data.LengthOfReferal;
        preferredPractitioner.Doctor.IsRenewReferral = data.IsRenewReferral;
        preferredPractitioner.Doctor.PathologyProvider = data.PathologyProvider;
        preferredPractitioner.Doctor.RadiologyProvider = data.RadiologyProvider;
        preferredPractitioner.Doctor.RefDate = data.RefDate;
        preferredPractitioner.Doctor.RefDurationOfReferral = data.RefDurationOfReferral;
        return preferredPractitioner;
    },
    WAAppointment: function(data) {
        return {
            RefFax: data.RefFax,
            IsUsualGP: data.IsUsualGP,
            UsualGPName: data.UsualGPName,
            UsualGPContactNumber: data.UsualGPContactNumber,
            UsualGPFaxNumber: data.UsualGPFaxNumber,
            IsSamePlacePreference: data.IsSamePlacePreference,
            IsTelehealthSuitable: data.IsTelehealthSuitable,
            IsRenewReferral: data.IsRenewReferral,
            PathologyProvider: data.PathologyProvider,
            RadiologyProvider: data.RadiologyProvider,
            HasConsultant: data.HasConsultant,
            ConsultantName: data.ConsultantName,
            ConsultantSite: data.ConsultantSite,
            ConsultantContactNumber: data.ConsultantContactNumber,
            ConsultantNote: data.ConsultantNote,
            InjuryType: data.InjuryType,
            Enable: 'Y'
        };
    }
};
