module.exports = {
    ServiceType: function(data, isWorkInjury) {
        var serviceType = '';
        if (data.specialist === 'Y') {
            serviceType += 'Specialist, ';
        }
        if (data.physiotherapy === 'Y' && !isWorkInjury) {
            serviceType += 'Physiotherapy, ';
        }
        if (data.GP === 'Y') {
            serviceType += 'GP, ';
        }
        if (data.rehab === 'Y') {
            serviceType += 'Rehabitation, ';
        }
        if (data.treatment === 'Y') {
            serviceType += 'Treatment, ';
        }
        serviceType = serviceType.substring(0, serviceType.length - 2);
        return serviceType;
    },
    GPReferral: function(gPreferral) {
        var GPReferral = '';
        switch (gPreferral) {
            case 'Y':
                GPReferral = 'Yes';
                break;
            case 'N':
                GPReferral = 'No';
                break;
            default:
                GPReferral = '';
                break;
        };
        return GPReferral;
    },
    TreatmentType: function(data) {
        var treatmentType = '';
        if (data.physiotherapy === 'Y') {
            treatmentType += 'Physiotherapy, ';
        }
        if (data.handTherapy === 'Y') {
            treatmentType += 'Hand Therapy, ';
        }
        if (data.exerciseRehab === 'Y') {
            treatmentType += 'Exercise Rehab, ';
        }
        treatmentType = treatmentType.substring(0, treatmentType.length - 2);
        return treatmentType;
    }
};
