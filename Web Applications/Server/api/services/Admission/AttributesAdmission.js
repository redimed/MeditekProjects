module.exports = {
    PatientAdmission: function() {
        return ['UID', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
    },
    PatientAdmissionData: function() {
        return ['UID', 'Module', 'Section', 'Category',
            'Type', 'Name', 'Value', 'ClinicalNote', 'Description'
        ];
    }
};
