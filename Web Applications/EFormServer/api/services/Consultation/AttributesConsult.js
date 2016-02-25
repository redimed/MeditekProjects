module.exports = {
    Consultation: function() {
        return ['UID', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
    },
    ConsultationData: function() {
        return ['UID', 'Module', 'Section', 'Category',
            'Type', 'Name', 'Value', 'ClinicalNote', 'Description'
        ];
    }
};
