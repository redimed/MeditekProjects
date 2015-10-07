module.exports = {
    Appointment: function(data) {
        return {
            UID: data.UIDAppt,
            SiteID: 1,
            // RequestDate: data.RequestDate,
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
            UID: data.UIDPatientAppt,
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
    ExamniationRequired: function(data) {
        return {
            Private: data.Private,
            Public: data.Public,
            DVA: data.DVA,
            WorkersComp: data.WorkersComp,
            MVIT: data.MVIT
        };
    },
    PrefPlasSurgon: function(data) {
        return {
            Name: data.Name
        };

    },
    TeleApptDetail: function(teleApptID, data) {
        return [{
                //Trauma
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Trauma',
                Name: 'Dislocation',
                Value: data.TraumaDislocation,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Trauma',
                Name: 'Fracture',
                Value: data.TraumaFracture,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Trauma',
                Name: 'Open',
                Value: data.TraumaOpen,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Trauma',
                Name: 'Closed',
                Value: data.TraumaClosed,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Trauma',
                Name: 'Displaced',
                Value: data.TraumaDisplaced,
                ClinicalNote: data.ClinicalNote
            },
            //Lacerations
            {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Hand',
                Value: data.LacerationsHand,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Nerve',
                Value: data.LacerationsNerve,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Tendon/musde',
                Value: data.LacerationsTendon,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Facial',
                Value: data.LacerationsFacial,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Others',
                Value: data.LacerationsOthers,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Skin loss',
                Value: data.LacerationsSkinLoss,
                ClinicalNote: data.ClinicalNote
            },
            //Skin cancer
            {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Lacerations',
                Name: 'Skin loss',
                Value: data.LacerationsSkinLoss,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Skin cancer',
                Name: 'BCC/SCC',
                Value: data.SkinCancerBCCSCC,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Skin cancer',
                Name: 'Melanoma',
                Value: data.SkinCancerMelanoma,
                ClinicalNote: data.ClinicalNote
            },
            //Hand condition
            {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Hand Condition',
                Name: 'Ganglion',
                Value: data.HandConditionGanglion,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Hand Condition',
                Name: 'Arthritis',
                Value: data.HandConditionArthritis,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Hand Condition',
                Name: 'DeQuervains/Trigger',
                Value: data.HandConditionDeQuervains,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'Hand Condition',
                Name: 'Contracture',
                Value: data.HandConditionContracture,
                ClinicalNote: data.ClinicalNote
            },
            //PNS
            {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'PNS',
                Name: 'Carpal Tunnel',
                Value: data.PNSCarpalTunnel,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'PNS',
                Name: 'Cubital Tunnel',
                Value: data.PNSCubitalTunnel,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'PNS',
                Name: 'Tarsal Tunnel',
                Value: data.PNSTarsalTunnel,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'PNS',
                Name: 'Other',
                Value: data.PNSOther,
                ClinicalNote: data.ClinicalNote
            }, {
                TelehealthAppointmentID: teleApptID,
                Section: 'Clinical Details',
                Category: 'Telehealth Appointment',
                Type: 'PNS',
                Name: 'Complex Reconstructive Case',
                Value: data.PNSComplex,
                ClinicalNote: data.ClinicalNote
            }
        ];
    },
};
