module.exports = {
    Appointment: function() {
        return ['ID', 'UID', 'SiteID', 'FromTime', 'ToTime', 'RequestDate',
            'ApprovalDate', 'Status', 'CreatedDate', 'Type', 'Code'
        ];
    },
    TelehealthAppointment: function() {
        return ['UID', 'Fund', 'FundType', 'Correspondence', 'Description', 'RefName',
            'RefHealthLink', 'RefAddress', 'RefTelePhone',
            'RefPostCode', 'RefSignature', 'RefDate', 'RefProviderNumber',
            'RefDurationOfReferral', 'PresentComplain', 'Allergy', 'Type'
        ];
    },
    PatientAppointment: function() {
        return ['UID', 'Title', 'MaritalStatus', 'FirstName', 'MiddleName', 'LastName', 'PreferredName',
            'PreviousName', 'Suburb', 'Postcode', 'State', 'CountryOfBirth',
            'DOB', 'Gender', 'Indigenous', 'Address1', 'Address2', 'Email1',
            'Email2', 'PhoneNumber', 'HomePhoneNumber', 'WorkPhoneNumber',
            'FaxNumber', 'InterpreterRequired', 'InterpreterLanguage',
            'OtherSpecialNeed', 'MedicareEligible', 'MedicareNumber',
            'MedicareReferenceNumber', 'MedicareExpiryDate', 'DVANumber',
            'PatientKinFirstName', 'PatientKinMiddleName', 'PatientKinLastName', 'PatientKinRelationship', 'PatientKinMobilePhoneNumber',
            'PatientKinHomePhoneNumber', 'PatientKinWorkPhoneNumber'
        ];
    },
    ExaminationRequired: function() {
        return ['Private', 'Public', 'DVA', 'WorkersComp', 'MVIT'];
    },
    PreferredPractitioner: function() {
        return ['Speciality', 'Name', 'SiteName'];
    },
    ClinicalDetail: function() {
        return ['UID', 'Section', 'Category', 'Type',
            'Name', 'Value', 'ClinicalNote', 'Description'
        ];
    },
    Doctor: function() {
        return ['UID', 'Title', 'FirstName', 'MiddleName', 'LastName',
            'Type', 'DOB', 'Address1', 'Address2', 'Postcode',
            'Suburb', 'State', 'Email', 'HomePhoneNumber',
            'WorkPhoneNumber', 'FaxNumber', 'Signature',
            'HealthLink', 'ProviderNumber'
        ];
    },
    Department: function() {
        return ['UID', 'DepartmentCode', 'DepartmentName', 'Description'];
    },
    Patient: function() {
        return ['ID', 'UID', 'Title', 'FirstName', 'MiddleName', 'LastName',
            'PreferredName', 'PreviousName', 'DOB', 'Gender', 'Indigenous',
            'Occupation', 'Address1', 'Address2', 'Postcode', 'Suburb',
            'State', 'Email1', 'Email2', 'HomePhoneNumber', 'WorkPhoneNumber',
            'FaxNumber', 'InterpreterRequired', 'InterperterLanguage', 'OtherSpecialNeed'
        ];
    },
    UserAccount: function() {
        return ['ID', 'UID', 'UserName', 'Email', 'PhoneNumber', 'Activated', 'Enable'];
    },
    WAAppointment: function() {
        return ['RefFax', 'IsUsualGP', 'UsualGPName', 'UsualGPContactNumber',
            'UsualGPFaxNumber', 'IsSamePlacePreference', 'IsTelehealthSuitable',
            'IsRenewReferral', 'PathologyProvider', 'RadiologyProvider', 'InjuryType',
            'HasConsultant', 'ConsultantName', 'ConsultantSite', 'ConsultantContactNumber',
            'ConsultantNote'
        ];
    },
    Country: function() {
        return ['UID', 'ISO2', 'ShortName', 'LongName', 'ISO3', 'NumCode',
            'UnMember', 'CallingCode', 'CCTLD', 'Description'
        ];
    },
    FileUpload: function() {
        return ['UID', 'UserAccountID', 'FileName', 'FileLocation', 'FileType',
            'FileExtension', 'Description'
        ];
    },
    
    Company: function() {
        return ['UID', 'CompanyName', 'Description']
    },

    CompanySite: function() {
        return ['UID', 'SiteName', 'Address1', 'Addresss2', 'Suburb', 'ContactName', 'ContactNumber']
    }
};
