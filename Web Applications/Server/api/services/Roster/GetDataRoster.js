module.exports = {
    GetRosterRepeat: function(data, userInfo) {
        var moment = require('moment');
        require('moment-range');
        var dataRes = [];
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
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var rangeDate = moment.range(fromTime, endRecurrence);
                    var arrayDateRepeat = [];
                    if (!_.isEmpty(rangeDate)) {
                        rangeDate.by('days', function(moment) {
                            console.log('moment', moment.format('YYYY-MM-DD HH:mm:ss'));
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime)) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
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
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var arrayDateRepeat = addDate(fromTime, toTime, endRecurrence, 1, []);
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime)) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
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
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
                    var arrayDateRepeat = addDate(fromTime, toTime, endRecurrence, 1, []);
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime) &&
                                moment(valueDate.fromTime).format('e') <= 5) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
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
                UID: UUIDService.Create(),
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
