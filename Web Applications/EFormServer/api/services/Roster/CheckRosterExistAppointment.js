module.exports = function(objCheck) {
    var $q = require('q');
    var defer = $q.defer();
    var moment = require('moment');
    require('moment-range');
    // if (!_.isEmpty(objCheck) &&
    //     !_.isEmpty(objCheck.data) &&
    //     !_.isEmpty(objCheck.userAccount)) {
    //     var whereClause = {};
    //     var arrRoster = null;
    //     var arrAppt = null;
    //     _.forEach(objCheck.userAccount, function(valueKey, indexKey) {
    //         if (moment(valueKey, 'YYYY-MM-DD Z', true).isValid() ||
    //             moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
    //             whereClause[indexKey] = moment(valueKey, 'YYYY-MM-DD HH:mm:ss Z').toDate();
    //         } else if (!_.isArray(valueKey) &&
    //             !_.isObject(valueKey)) {
    //             whereClause[indexKey] = valueKey;
    //         }
    //     });
    //     Roster.findAll({
    //             attributes: Services.AttributesRoster.Roster(),
    //             include: [{
    //                 attributes: ['ID'],
    //                 model: UserAccount,
    //                 required: true,
    //                 where: whereClause
    //             }],
    //             where: {
    //                 UID: {
    //                     $in: objCheck.data,
    //                 },
    //                 Enable: 'Y'
    //             },
    //             transaction: objCheck.transaction
    //         })
    //         .then(function(rosterRes) {
    //             if (!_.isEmpty(rosterRes)) {
    //                 arrRoster = JSON.parse(JSON.stringify(rosterRes));
    //                 return Appointment.findAll({
    //                     attributes: Services.AttributesAppt.Appointment(),
    //                     include: [{
    //                         attributes: Services.AttributesAppt.Doctor(),
    //                         model: Doctor,
    //                         required: true,
    //                         include: [{
    //                             attributes: ['ID'],
    //                             model: UserAccount,
    //                             required: true,
    //                             where: whereClause
    //                         }]
    //                     }],
    //                     transaction: objCheck.transaction
    //                 });
    //             } else {
    //                 var error = new Error('DestroyRoster.not.exist');
    //                 defer.reject(error);
    //             }
    //         }, function(err) {
    //             defer.reject(err);
    //         })
    //         .then(function(apptRes) {
    //             if (!_.isEmpty(apptRes)) {
    //                 var arrRosterOverlap = [];
    //                 arrAppt = JSON.parse(JSON.stringify(apptRes));
    //                 _.forEach(arrAppt, function(valueAppt, indexAppt) {
    //                     _.forEach(arrRoster, function(valueRoster, indexRoster) {
    //                         var fromTimeAppt = moment(valueAppt.FromTime).format('YYYY-MM-DD HH:mm:ss');
    //                         var toTimeAppt = moment(valueAppt.ToTime).format('YYYY-MM-DD HH:mm:ss');
    //                         var fromTimeRoster = moment(valueRoster.FromTime).format('YYYY-MM-DD HH:mm:ss');
    //                         var toTimeRoster = moment(valueRoster.ToTime).format('YYYY-MM-DD HH:mm:ss');
    //                         var rangeAppt = moment.range(fromTimeAppt, toTimeRoster);
    //                         var rangeRoster = moment.range(fromTimeRoster, toTimeRoster);
    //                         if (rangeRoster.overlaps(rangeAppt) === true) {
    //                             arrRosterOverlap.push(valueRoster);
    //                         }
    //                     });
    //                 });
    //                 if (!_.isEmpty(arrRosterOverlap)) {
    //                     arrRosterOverlap = _.uniq(arrRosterOverlap, 'UID');
    //                     defer.reject({
    //                         status: 'existAppt',
    //                         dataExistAppt: arrRosterOverlap
    //                     });
    //                     defer.resolve({
    //                         status: 'success'
    //                     });
    //                 } else {
    //                     defer.resolve({
    //                         status: 'success'
    //                     });
    //                 }
    //             } else {
    //                 defer.resolve({
    //                     status: 'success'
    //                 });
    //             }
    //         }, function(err) {
    //             defer.reject(err);
    //         });
    // } else {
    //     var error = new Error('CheckRosterExistAppointment.data.not.exist');
    //     defer.reject(error);
    // }
    defer.resolve({
        status: 'success'
    });
    return defer.promise;
};
