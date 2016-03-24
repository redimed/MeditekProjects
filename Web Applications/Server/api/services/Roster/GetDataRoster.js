module.exports = {
    GetRosterRepeat: function(data, userInfo) {
        var moment = require('moment');
        require('moment-range');
        var dataRes = [];
        var dateKey = moment(data.FromTime).format('YYYY-MM-DD');
        if (!_.isEmpty(data) &&
            data.IsRecurrence == 'Y' &&
            HelperService.CheckExistData(data.RecurrenceType) &&
            HelperService.CheckExistData(data.EndRecurrence) &&
            HelperService.CheckExistData(data.FromTime) &&
            HelperService.CheckExistData(data.ToTime) &&
            (moment(data.FromTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.ToTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.EndRecurrence, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z', true).isValid())) {
            switch (data.RecurrenceType) {
                case 'weekly':
                    var endRecurrence = data.EndRecurrence;
                    var arrayDateRepeat = [];
                    var timeTo = data.ToTime.split(' ')[1];
                    var timeFrom = data.FromTime.split(' ')[1];
                    var zoneFrom = data.FromTime.split(' ')[2];
                    var zoneTo = data.ToTime.split(' ')[2];
                    var startDate = data.FromTime.split(' ')[0];
                    var endDate = endRecurrence.split(' ')[0];
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            var objectDate = {
                                fromTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom).format('YYYY-MM-DD HH:mm:ss Z'),
                                toTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo).format('YYYY-MM-DD HH:mm:ss Z')
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime) &&
                                moment(valueDate.fromTime).format('e') ===
                                moment(startDate).format('e')) {
                                var dateRepeat = moment(valueDate.fromTime).format('YYYY-MM-DD');
                                var isdateKey = dateRepeat === dateKey;
                                var objectRoster = {
                                    UID: isdateKey ? data.UID ? data.UID : UUIDService.Create() : UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                case 'daily':
                    var endRecurrence = data.EndRecurrence;
                    var arrayDateRepeat = [];
                    var timeTo = data.ToTime.split(' ')[1];
                    var timeFrom = data.FromTime.split(' ')[1];
                    var zoneFrom = data.FromTime.split(' ')[2];
                    var zoneTo = data.ToTime.split(' ')[2];
                    var startDate = data.FromTime.split(' ')[0];
                    var endDate = endRecurrence.split(' ')[0];
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            var objectDate = {
                                fromTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom).format('YYYY-MM-DD HH:mm:ss Z'),
                                toTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo).format('YYYY-MM-DD HH:mm:ss Z')
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime)) {
                                var dateRepeat = moment(valueDate.fromTime).format('YYYY-MM-DD');
                                var isdateKey = dateRepeat === dateKey;
                                var objectRoster = {
                                    UID: isdateKey ? data.UID ? data.UID : UUIDService.Create() : UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                case 'weekday':
                    var endRecurrence = data.EndRecurrence;
                    var arrayDateRepeat = [];
                    var timeTo = data.ToTime.split(' ')[1];
                    var timeFrom = data.FromTime.split(' ')[1];
                    var zoneFrom = data.FromTime.split(' ')[2];
                    var zoneTo = data.ToTime.split(' ')[2];
                    var startDate = data.FromTime.split(' ')[0];
                    var endDate = endRecurrence.split(' ')[0];
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            var objectDate = {
                                fromTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom).format('YYYY-MM-DD HH:mm:ss Z'),
                                toTime: moment(moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo).format('YYYY-MM-DD HH:mm:ss Z')
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime) &&
                                moment(valueDate.fromTime).format('e') ===
                                moment(startDate).format('e') &&
                                moment(valueDate.fromTime).format('e') <= 5) {
                                var dateRepeat = moment(valueDate.fromTime).format('YYYY-MM-DD');
                                var isdateKey = dateRepeat === dateKey;
                                var objectRoster = {
                                    UID: isdateKey ? data.UID ? data.UID : UUIDService.Create() : UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        } else if (!_.isEmpty(data) &&
            data.IsRecurrence == 'N' &&
            HelperService.CheckExistData(data.FromTime) &&
            HelperService.CheckExistData(data.ToTime) &&
            (moment(data.FromTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.ToTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid())) {
            var objectRoster = {
                UID: data.UID || UUIDService.Create(),
                FromTime: data.FromTime,
                ToTime: data.ToTime,
                IsRecurrence: data.IsRecurrence,
                RecurrenceType: data.RecurrenceType,
                EndRecurrence: data.EndRecurrence,
                Enable: 'Y',
                CreatedBy: userInfo.ID
            };
            dataRes.push(objectRoster);
        }
        return dataRes;
    },
};
