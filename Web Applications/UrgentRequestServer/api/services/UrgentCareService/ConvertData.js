module.exports = {
    ServiceType: function(data) {
        var serviceType = '';
        if (data.physiotherapy === 'Y') {
            serviceType += 'Physiotherapy';
        }
        if (data.specialist === 'Y') {
            serviceType += ', ' + 'Specialist';
        }
        if (data.handTherapy === 'Y') {
            serviceType += ', ' + 'HandTherapy';
        }
        if (data.GP === 'Y') {
            serviceType += ', ' + 'GP';
        }
        return serviceType;
    },
    GPReferal: function(gPreferal) {
        var GPReferal = '';
        switch (gPreferal) {
            case 'Y':
                GPReferal = 'Yes';
                break;
            case 'N':
                GPReferal = 'No';
                break;
            default:
                GPReferal = '';
                break;
        };
        return GPReferal;
    }
};
