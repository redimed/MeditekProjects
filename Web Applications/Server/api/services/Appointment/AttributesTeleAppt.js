module.exports = {
    Appointment: function() {
        return ['UID', 'FromTime', 'ToTime', 'RequestDate', 'ApprovalDate', 'Status'];
    },
    TelehealthAppointment: function() {
        return ['UID', 'Fund', 'Correspondence', 'RefName',
            'RefHealthLink', 'RefAddress', 'RefTelePhone',
            'RefPostCode', 'RefSignature', 'RefDate', 'RefProviderNumber',
            'RefDurationOfReferal', 'PresentComplain', 'Allergy'
        ];
    },
    PatientAppointment: function() {
        return ['UID', 'FirstName', 'MiddleName', 'LastName',
            'DOB', 'Email', 'Address1', 'Address2', 'Suburb', 'Postcode',
            'Email', 'WorkPhoneNumber', 'HomePhoneNumber'
        ];
    },
    ExaminationRequired: function() {
        return ['Private', 'Public', 'DVA', 'WorkersComp', 'MVIT'];
    },
    PreferredPractitioner: function() {
        return ['Name'];
    },
    ClinicalDetail: function() {
        return ['UID', 'Section', 'Category', 'Type', 'Name', 'Value', 'ClinicalNote', 'Description'];
    },
    Doctor: function() {
        return ['UID', 'FirstName', 'MiddleName', 'LastName',
            'HealthLink', 'Address1', 'Address2', 'WorkPhoneNumber',
            'Postcode', 'ProviderNumber', 'Signature'
        ];
    },
    Department: function() {
        return ['UID', 'DepartmentCode', 'DepartmentName', 'Description'];
    },
    Patient: function() {
        return ['UID', 'FirstName', 'MiddleName', 'LastName', 'DOB',
            'Gender', 'Address1', 'Address2', 'Suburb', 'Postcode', 'Email', 'HomePhoneNumber', 'WorkPhoneNumber'
        ];
    },
    UserAccount: function() {
        return ['UID', 'UserName', 'Email', 'PhoneNumber', 'Activated', 'Enable'];
    }
};
