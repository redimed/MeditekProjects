module.exports = {
    'Patient/PatientController': {
        'GetListCountry': true,
        'LoadListPatient': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'EXTERTAL_PRACTITIONER' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('LoadListPatient - user must be admin, assistant or doctor');
        }],
        'PatientController': ['isAuthenticated', 'isAdmin'],
        'CheckPatient': true,
        'SearchPatient': true,
        'RegisterPatient': true,
        'GetPatient': true,
        'CreatePatientForOnlineBooking':'isIp',

    }
}
