/*
GetPaginationAppointment: get information pagination list [WA, Telehealth] Appointment
input: information WA Appointment
output: object pagination with condition received
 */
module.exports = function(data, userInfo) {
    var moment = require('moment');
    var pagination = {
        filterAppointment: [],
        filterDoctor: [],
        filterTelehealthAppointment: [],
        filterPatientAppointment: [],
        filterPatient: [],
        order: [],
        limit: data.Limit,
        offset: data.Offset
    };
    //get filter params
    if (HelperService.CheckExistData(data.Filter) &&
        _.isArray(data.Filter)) {
        var Filter = data.Filter;
        Filter.forEach(function(filter, index) {
            if (HelperService.CheckExistData(filter) &&
                _.isObject(filter)) {
                var keyModel = Object.keys(filter)[0];
                if (_.isObject(filter[keyModel])) {
                    for (var keyFilter in filter[keyModel]) {
                        if (HelperService.CheckExistData(keyFilter) &&
                            HelperService.CheckExistData(filter[keyModel][keyFilter])) {
                            //check format value is date
                            var tempFilter = {};
                            if (moment(filter[keyModel][keyFilter], 'YYYY-MM-DD Z', true).isValid() ||
                                moment(filter[keyModel][keyFilter], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                //data valid date
                                var dateActual = moment(filter[keyModel][keyFilter], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                var dateAdded = moment(dateActual).add(1, 'day').toDate();
                                var tempFilter = {};
                                tempFilter[keyFilter] = {
                                    '$gte': dateActual,
                                    '$lt': dateAdded
                                };
                            } else {
                                tempFilter[keyFilter] = filter[keyModel][keyFilter];
                            }
                            //data invalid date
                            switch (keyModel) {
                                case 'Appointment':
                                    pagination.filterAppointment.push(tempFilter);
                                    break;
                                case 'Doctor':
                                    pagination.filterDoctor.push(tempFilter);
                                    break;
                                case 'TelehealthAppointment':
                                    pagination.filterTelehealthAppointment.push(tempFilter);
                                    break;
                                case 'PatientAppointment':
                                    pagination.filterPatientAppointment.push(tempFilter);
                                    break;
                                case 'Patient':
                                    pagination.filterPatient.push(tempFilter);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
        });
    }
    //get seach params
    if (HelperService.CheckExistData(data.Search) &&
        _.isArray(data.Search)) {
        var Search = data.Search;
        Search.forEach(function(search, index) {
            if (HelperService.CheckExistData(search) &&
                _.isObject(search)) {
                var keyModel = Object.keys(search)[0];
                if (_.isObject(search[keyModel])) {
                    for (var keySearch in search[keyModel]) {
                        if (HelperService.CheckExistData(keySearch) &&
                            HelperService.CheckExistData(search[keyModel][keySearch])) {
                            var tempSearch = {};
                            if (keySearch === 'FullName') {
                                var arraySearch = search[keyModel][keySearch].split(' ');
                                var arraySearchObject = [];
                                arraySearch.forEach(function(value, index) {
                                    arraySearchObject.push({
                                        '$like': '%' + value + '%'
                                    });
                                });
                                tempSearch = {
                                    '$or': {
                                        FirstName: {
                                            '$or': arraySearchObject
                                        },
                                        MiddleName: {
                                            '$or': arraySearchObject
                                        },
                                        LastName: {
                                            '$or': arraySearchObject
                                        }
                                    }
                                };

                            } else {
                                //case normal
                                tempSearch[keySearch] = {
                                    '$like': '%' + search[keyModel][keySearch] + '%'
                                };

                            }
                            switch (keyModel) {
                                case 'Appointment':
                                    pagination.filterAppointment.push(tempSearch);
                                    break;
                                case 'Doctor':
                                    pagination.filterDoctor.push(tempSearch);
                                    break;
                                case 'TelehealthAppointment':
                                    var tempSearch = {};
                                    pagination.filterTelehealthAppointment.push(tempSearch);
                                    break;
                                case 'PatientAppointment':
                                    pagination.filterPatientAppointment.push(tempSearch);
                                    break;
                                case 'Patient':
                                    pagination.filterPatient.push(tempSearch);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }

            }
        });
    }
    //get order params
    if (HelperService.CheckExistData(data.Order) &&
        _.isArray(data.Order)) {
        var Order = data.Order;
        Order.forEach(function(order, index) {
            if (HelperService.CheckExistData(order) &&
                _.isObject(order)) {
                var keyModel = Object.keys(order)[0];
                if (_.isObject(order[keyModel])) {
                    for (var keyOrder in order[keyModel]) {
                        if (HelperService.CheckExistData(keyOrder) &&
                            HelperService.CheckExistData(order[keyModel][keyOrder])) {
                            var tempOrder = [];
                            switch (keyModel) {
                                case 'Appointment':
                                    tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                    pagination.order.push(tempOrder);
                                    break;
                                case 'Doctor':
                                    tempOrder = [Doctor, keyOrder, order[keyModel][keyOrder]];
                                    pagination.order.push(tempOrder);
                                    break;
                                case 'TelehealthAppointment':
                                    tempOrder = [TelehealthAppointment, keyOrder, order[keyModel][keyOrder]];
                                    pagination.order.push(tempOrder);
                                    break;
                                case 'Patient':
                                    tempOrder = [Patient, keyOrder, order[keyModel][keyOrder]];
                                    pagination.order.push(tempOrder);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }

            }
        });
    }
    //get range params
    if (HelperService.CheckExistData(data.Range) &&
        _.isArray(data.Range)) {
        var Range = data.Range;
        Range.forEach(function(range, index) {
            if (HelperService.CheckExistData(range) &&
                _.isObject(range)) {
                var keyModel = Object.keys(range)[0];
                if (_.isObject(range[keyModel])) {
                    for (var keyRange in range[keyModel]) {
                        if (HelperService.CheckExistData(keyRange) &&
                            HelperService.CheckExistData(range[keyModel][keyRange])) {
                            var start = null,
                                end = null;
                            if (moment(range[keyModel][keyRange][0], 'YYYY-MM-DD Z', true).isValid() ||
                                moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z', true).isValid() ||
                                moment(range[keyModel][keyRange][1], 'YYYY-MM-DD Z', true).isValid() ||
                                moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                if (moment(range[keyModel][keyRange][0], 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                    start = moment(range[keyModel][keyRange][0], 'YYYY-MM-DD HH:mm:ss Z').toDate();
                                }
                                if (moment(range[keyModel][keyRange][1], 'YYYY-MM-DD Z', true).isValid() ||
                                    moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) {
                                    end = moment(range[keyModel][keyRange][1], 'YYYY-MM-DD HH:mm:ss Z');
                                    end = moment(end).add(1, 'day').toDate();
                                }
                            } else {
                                start = range[keyModel][keyRange][0];
                                end = range[keyModel][keyRange][1];
                            }
                            var tempRange = {};
                            tempRange[keyRange] = {};
                            if (HelperService.CheckExistData(start)) {
                                tempRange[keyRange]['$gte'] = start;
                            }
                            if (HelperService.CheckExistData(end)) {
                                tempRange[keyRange]['$lt'] = end;
                            }
                            if (HelperService.CheckExistData(tempRange[keyRange]) &&
                                !_.isEmpty(tempRange[keyRange])) {
                                switch (keyModel) {
                                    case 'Appointment':
                                        pagination.filterAppointment.push(tempRange);
                                        break;
                                    case 'Doctor':
                                        pagination.filterDoctor.push(tempRange);
                                        break;
                                    case 'TelehealthAppointment':
                                        pagination.filterTelehealthAppointment.push(tempRange);
                                        break;
                                    case 'PatientAppointment':
                                        pagination.filterPatientAppointment.push(tempRange);
                                        break;
                                    case 'Patient':
                                        pagination.filterPatient.push(tempRange);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }

            }
        });
    }
    //add roles
    var role = HelperService.GetRole(userInfo.roles);
    if (role.isInternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                ID: userInfo.ID
            }
        };
        pagination.filterDoctor.push(filterRoleTemp);
    } else if (role.isExternalPractitioner) {
        var filterRoleTemp = {
            '$and': {
                CreatedBy: userInfo.ID
            }
        };
        pagination.filterAppointment.push(filterRoleTemp);
    } else if (!role.isAdmin &&
        !role.isAssistant) {
        pagination.limit = 0;
    }
    return pagination;
};
