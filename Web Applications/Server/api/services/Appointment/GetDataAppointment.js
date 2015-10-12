module.exports = {
    Appointment: function(data) {
        return {
            SiteID: 1,
            FromTime: data.FromTime,
            ToTime: data.ToTime,
            RequestDate: data.RequestDate,
            ApprovalDate: data.ApprovalDate,
            Status: 'Watting for approve',
            Enable: 'Y'
        };
    },
    TelehealthAppointment: function(data) {
        return {
            RefName: data.RefName,
            RefHealthLink: data.RefHealthLink,
            RefAddress: data.RefAddress,
            RefTelePhone: data.RefTelePhone,
            RefPostCode: data.RefPostCode,
            RefSignature: data.RefSignature,
            RefDate: data.RefDate,
            RefProviderNumber: data.RefProviderNumber,
            RefDurationOfReferal: data.RefDurationOfReferal
        };
    },
    PatientAppointment: function(data) {
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
    PreferedPlasticSurgeon: function(data) {
        return {
            Name: data.Name
        };

    },
    ClinicalDetails: function(teleApptID, data) {
        data.forEach(function(value, index) {
            data[index].UID = UUIDService.Create();
            data[index].TelehealthAppointmentID = teleApptID;
        });
        return data;
    },
    Patient: function(data) {
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
    Doctor: function(data) {
        return {
            FirstName: data.FirstName,
            MiddleName: data.MiddleName,
            LastName: data.LastName,
            Phone: data.Phone,
            DepartmentID: data.DepartmentID
        };
    }
};
