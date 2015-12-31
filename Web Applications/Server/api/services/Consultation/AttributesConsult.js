module.exports = {
    Consultation: function() {
        return ['UID'];
    },
    ConsultationData: function() {
        return ['UID', 'Module', 'Section', 'Category',
            'Type', 'Name', 'Value', 'ClinicalNote', 'Description'
        ];
    }
};
