module.exports = {
    'Roster/RosterController': {
        'RequestRoster': ['isAuthenticated', 'isAdminOrAssistant'],
        'UpdateRequestRoster': ['isAuthenticated', 'isAdminOrAssistant'],
        'GetDetailRoster': ['isAuthenticated', 'isAdminOrAssistant'],
        'GetListRoster': ['isAuthenticated', function(req, res, next) {
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
            return res.unauthor('GetListRoster - user must be admin, assistant or doctor');
        }],
        'DestroyRoster': ['isAuthenticated', 'isAdminOrAssistant']
    }
};
