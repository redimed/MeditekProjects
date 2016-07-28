module.exports = {
    'Booking/BookingController': {
        'GetListBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('GetListBooking - user must be admin, assistant or doctor');
        }],
        'RequestBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('RequestBooking - user must be admin, assistant or doctor');
        }],
        'UpdateRequestBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('UpdateRequestBooking - user must be admin, assistant or doctor');
        }],
        'GetDetailBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('GetDetailBooking - user must be admin, assistant or doctor');
        }],
        'DestroyBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('DestroyBooking - user must be admin, assistant or doctor');
        }],
        'UpdateStatusBooking': ['isAuthenticated', function(req, res, next) {
            var isNext = false;
            _.forEach(req.user.roles, function(role_v, role_i) {
                if (role_v.RoleCode == 'ADMIN' ||
                    role_v.RoleCode == 'ASSISTANT' ||
                    role_v.RoleCode == 'INTERNAL_PRACTITIONER') {
                    isNext = true
                }
            });
            if (isNext) {
                return next();
            }
            return res.unauthor('UpdateStatusBooking - user must be admin, assistant or doctor');
        }]
    }
};
