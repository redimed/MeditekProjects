module.exports = {
    ServiceType: function(data) {
        var serviceType = '';
        if (data.physiotherapy === 'Y') {
            serviceType += 'Physiotherapy, ';
        }
        if (data.specialist === 'Y') {
            serviceType += 'Specialist, ';
        }
        if (data.handTherapy === 'Y') {
            serviceType += 'HandTherapy, ';
        }
        if (data.GP === 'Y') {
            serviceType += 'GP, ';
        }
        if (data.rehab === 'Y') {
            serviceType += 'Rehabitation, ';
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
    }
};
