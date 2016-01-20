module.exports = function(objCheck) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    Roster.findOne({
            attributes: Services.AttributesRoster.Roster(),
            include: [{
                attributes: ['ID'],
                model: UserAccount,
                required: true
            }],
            where: {
                UID: objCheck.data,
                Enable: 'Y'
            },
            transaction: objCheck.transaction
        })
        .then(function(rosterRes) {
            if (!_.isEmpty(rosterRes)) {
                rosterRes = JSON.parse(JSON.stringify(rosterRes));
                var fromTime = moment(rosterRes.FromTime).toDate();
                var toTime = moment(rosterRes.ToTime).toDate();
                return Appointment.findAll({
                    attributes: Services.AttributesAppt.Appointment(),
                    include: [{
                        attributes: Services.AttributesAppt.Doctor(),
                        model: Doctor,
                        required: true,
                        where: {
                            UserAccountID: rosterRes.UserAccounts[0].ID
                        }
                    }],
                    where: {
                        FromTime: {
                            $gte: fromTime
                        },
                        ToTime: {
                            $lte: toTime
                        }
                    },
                    transaction: objCheck.transaction
                });
            } else {
                var error = new Error('DestroyRoster.not.exist');
                defer.reject(error);
            }
        }, function(err) {
            defer.reject(err);
        })
        .then(function(apptRes) {
            if (!_.isEmpty(apptRes)) {
                var error = new Error('existAppointment');
                error.data = apptRes;
                defer.reject(error);
            } else {
                defer.resolve('notExistAppointment');
            }
        }, function(err) {
            defer.reject(err);
        });
    return defer.promise;
};
