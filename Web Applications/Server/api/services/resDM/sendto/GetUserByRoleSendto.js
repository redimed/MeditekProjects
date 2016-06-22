var dmUtils = require('../../resDM/dmUtils');
dmLog = dmUtils.dmLog;
module.exports = function(req, res) {
    try {
        var error = new Error('GetUserByRole.Error');
        var dmObj = req.dmObj;
        // dmLog("GetUserByRole ");
        var whereClause = {
            Role: {}
        };
        whereClause.Role.RoleCode = dmObj.RoleCode;
        console.log("GetUserByRole ", whereClause);
        if (_.isEmpty(whereClause.Role)) {
            error.pushError('whereClause.null');
            throw error;
        };
        return UserAccount.findAll({
            attributes: ['ID', 'UID'],
            include: [{
                model: Role,
                attributes: ['ID', 'UID'],
                where: whereClause.Role
            }
            // , {
            //     model: TelehealthUser,
            //     attributes: ['UID']
            // }
            ]
        }).then(function(result) {
            var listTeleUID = [];
            result.forEach(function(User, index) {
                listTeleUID.push(User.UID);
                // dmLog("result TelehealthUser ", User.telehealth.UID);
            });
            return listTeleUID;
        });
    } catch (err) {
        dmLog("GetUserByRole ", err);
    }
}
