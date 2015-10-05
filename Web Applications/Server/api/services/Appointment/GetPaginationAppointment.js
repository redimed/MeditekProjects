module.exports = function(data) {
    var pagination = {
        filterAppointment: [],
        filterDoctor: [],
        filterTelehealthAppointment: [],
        filterPatientAppointment: [],
        orderAppointment: [],
        orderDoctor: [],
        orderTelehealthAppointment: [],
        orderPatientAppointment: [],
        limit: data.Limit,
        offset: data.Offset
    };
    //get filter params
    if (!_.isUndefined(data.Filter) &&
        !_.isEmpty(data.Filter) &&
        !_.isNull(data.Filter) &&
        _.isArray(data.Filter)) {
        var Filter = data.Filter;
        Filter.forEach(function(filter, index) {
            if (!_.isUndefined(filter) &&
                !_.isEmpty(filter) &&
                !_.isNull(filter) &&
                _.isObject(filter)) {
                var keyModel = Object.keys(filter)[0];
                if (_.isObject(filter[keyModel])) {
                    for (var keyFilter in filter[keyModel]) {
                        if (!_.isUndefined(keyFilter) &&
                            !_.isEmpty(keyFilter) &&
                            !_.isNull(keyFilter) &&
                            !_.isUndefined(filter[keyModel][keyFilter]) &&
                            !_.isEmpty(filter[keyModel][keyFilter]) &&
                            !_.isNull(filter[keyModel][keyFilter])) {
                            switch (keyModel) {
                                case 'Appointment':
                                    var tempFilter = {};
                                    tempFilter[keyFilter] = filter[keyModel][keyFilter];
                                    pagination.filterAppointment.push(tempFilter);
                                    break;
                                case 'Doctor':
                                    var tempFilter = {};
                                    tempFilter[keyFilter] = filter[keyModel][keyFilter];
                                    pagination.filterDoctor.push(tempFilter);
                                    break;
                                case 'TelehealthAppointment':
                                    var tempFilter = {};
                                    tempFilter[keyFilter] = filter[keyModel][keyFilter];
                                    pagination.filterTelehealthAppointment.push(tempFilter);
                                    break;
                                case 'PatientAppointment':
                                    var tempFilter = {};
                                    tempFilter[keyFilter] = filter[keyModel][keyFilter];
                                    pagination.filterPatientAppointment.push(tempFilter);
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
    if (!_.isUndefined(data.Search) &&
        !_.isEmpty(data.Search) &&
        !_.isNull(data.Search) &&
        _.isArray(data.Search)) {
        var Search = data.Search;
        Search.forEach(function(search, index) {
            if (!_.isUndefined(search) &&
                !_.isEmpty(search) &&
                !_.isNull(search) &&
                _.isObject(search)) {
                var keyModel = Object.keys(search)[0];
                if (_.isObject(search[keyModel])) {
                    for (var keySearch in search[keyModel]) {
                        if (!_.isUndefined(keySearch) &&
                            !_.isEmpty(keySearch) &&
                            !_.isNull(keySearch) &&
                            !_.isUndefined(search[keyModel][keySearch]) &&
                            !_.isEmpty(search[keyModel][keySearch]) &&
                            !_.isNull(search[keyModel][keySearch])) {
                            switch (keyModel) {
                                case 'Appointment':
                                    var tempSearch = {};
                                    tempSearch[keySearch] = {
                                        '$like': '%' + search[keyModel][keySearch] + '%'
                                    };
                                    pagination.filterAppointment.push(tempSearch);
                                    break;
                                case 'Doctor':
                                    var tempSearch = {};
                                    tempSearch[keySearch] = {
                                        '$like': '%' + search[keyModel][keySearch] + '%'
                                    };
                                    pagination.filterDoctor.push(tempSearch);
                                    break;
                                case 'TelehealthAppointment':
                                    var tempSearch = {};
                                    tempSearch[keySearch] = {
                                        '$like': '%' + search[keyModel][keySearch] + '%'
                                    };
                                    pagination.filterTelehealthAppointment.push(tempSearch);
                                    break;
                                case 'PatientAppointment':
                                    var tempSearch = {};
                                    tempSearch[keySearch] = {
                                        '$like': '%' + search[keyModel][keySearch] + '%'
                                    };
                                    pagination.filterPatientAppointment.push(tempSearch);
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
    if (!_.isUndefined(data.Order) &&
        !_.isEmpty(data.Order) &&
        !_.isNull(data.Order) &&
        _.isArray(data.Order)) {
        var Order = data.Order;
        Order.forEach(function(order, index) {
            if (!_.isUndefined(order) &&
                !_.isEmpty(order) &&
                !_.isNull(order) &&
                _.isObject(order)) {
                var keyModel = Object.keys(order)[0];
                if (_.isObject(order[keyModel])) {
                    for (var keyOrder in order[keyModel]) {
                        if (!_.isUndefined(keyOrder) &&
                            !_.isEmpty(keyOrder) &&
                            !_.isNull(keyOrder) &&
                            !_.isUndefined(order[keyModel][keyOrder]) &&
                            !_.isEmpty(order[keyModel][keyOrder]) &&
                            !_.isNull(order[keyModel][keyOrder])) {
                            switch (keyModel) {
                                case 'Appointment':
                                    var tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                    pagination.orderAppointment.push(tempOrder);
                                    break;
                                case 'Doctor':
                                    var tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                    pagination.orderDoctor.push(tempOrder);
                                    break;
                                case 'TelehealthAppointment':
                                    var tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                    pagination.orderTelehealthAppointment.push(tempOrder);
                                    break;
                                case 'PatientAppointment':
                                    var tempOrder = [keyOrder, order[keyModel][keyOrder]];
                                    pagination.orderPatientAppointment.push(tempOrder);
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
    if (!_.isUndefined(data.Range) &&
        !_.isEmpty(data.Range) &&
        !_.isNull(data.Range) &&
        _.isArray(data.Range)) {
        var Range = data.Range;
        Range.forEach(function(range, index) {
            if (!_.isUndefined(range) &&
                !_.isEmpty(range) &&
                !_.isNull(range) &&
                _.isObject(range)) {
                var keyModel = Object.keys(range)[0];
                if (_.isObject(range[keyModel])) {
                    for (var keyRange in range[keyModel]) {
                        if (!_.isUndefined(keyRange) &&
                            !_.isEmpty(keyRange) &&
                            !_.isNull(keyRange) &&
                            !_.isUndefined(range[keyModel][keyRange]) &&
                            !_.isEmpty(range[keyModel][keyRange]) &&
                            !_.isNull(range[keyModel][keyRange])) {
                            switch (keyModel) {
                                case 'Appointment':
                                    var start = range[keyModel][keyRange][0];
                                    var end = range[keyModel][keyRange][1];
                                    var tempRange = {};
                                    tempRange[keyRange] = {
                                        '$between': [start, end]
                                    };
                                    pagination.filterAppointment.push(tempRange);
                                    break;
                                case 'Doctor':
                                    var start = range[keyModel][keyRange][0];
                                    var end = range[keyModel][keyRange][1];
                                    var tempRange = {};
                                    tempRange[keyRange] = {
                                        '$between': [start, end]
                                    };
                                    pagination.filterDoctor.push(tempRange);
                                    break;
                                case 'TelehealthAppointment':
                                    var start = range[keyModel][keyRange][0];
                                    var end = range[keyModel][keyRange][1];
                                    var tempRange = {};
                                    tempRange[keyRange] = {
                                        '$between': [start, end]
                                    };
                                    pagination.filterTelehealthAppointment.push(tempRange);
                                    break;
                                case 'PatientAppointment':
                                    var start = range[keyModel][keyRange][0];
                                    var end = range[keyModel][keyRange][1];
                                    var tempRange = {};
                                    tempRange[keyRange] = {
                                        '$between': [start, end]
                                    };
                                    pagination.filterPatientAppointment.push(tempRange);
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
    return pagination;
};
