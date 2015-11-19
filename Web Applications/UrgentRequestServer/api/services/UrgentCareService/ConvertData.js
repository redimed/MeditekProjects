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
        if (data.handTherapy === 'Y' && !isWorkInjury) {
            serviceType += 'Hand Therapy, ';
        }
        if (data.treatment === 'Y') {
            serviceType += 'Treatment, ';
        }
        serviceType = serviceType.substring(0, serviceType.length - 2);
        serviceType = (HelperService.CheckExistData(serviceType) && serviceType.length !== 0) ? serviceType : '(None)';
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
                GPReferral = '(None)';
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
        treatmentType = (HelperService.CheckExistData(treatmentType) && treatmentType.length !== 0) ? treatmentType : '(None)';
        return treatmentType;
    }
};
