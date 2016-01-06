module.exports = {
    Admission: function() {
        return ['UID', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
    },
    AdmissionData: function() {
        return ['UID', 'Module', 'Section', 'Category',
            'Type', 'Name', 'Value', 'ClinicalNote', 'Description'
        ];
    }
};
