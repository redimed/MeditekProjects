module.exports = {
    AppointmentCreate: function(data) {
        return {
            SiteID: data.SiteID,
            RequestDate: data.RequestDate,
            Status: 'Watting for approve',
            Enable: 'Y'
        };
    },
    AppointmentUpdate: function(data) {
        return {
            FromTime: data.FromTime,
            ToTime: data.ToTime,
            ApprovalDate: data.ApprovalDate,
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
            RefPostCode: data.PostCode,
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
            Fund: data.Fund
        };
    },
    PatientAppointmentCreate: function(data) {
        return {
            FirstName: data.FirstName,
            LastName: data.LastName,
            DOB: data.DOB,
            Address: data.Address,
            Suburb: data.Suburb,
            Postcode: data.Postcode,
            Email: data.Email,
            PhoneNumber: data.PhoneNumber,
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
    PreferedPlasticSurgeon: function(teleApptID, data) {
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
