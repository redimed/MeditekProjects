var app = angular.module('app.authentication.WAAppointment.directives.listWAAppoint', []);
app.directive('listWaapointment', function(WAAppointmentService, $modal, $cookies,toastr) {
    return {
        restrict: 'E',
        templateUrl: "modules/WAAppointment/directives/templates/listWAApointment.html",
        link: function(scope) {
            scope.info = {
                apptStatus: WAConstant.apptStatus,
                paging: {
                    currentPage: 1,
                    itemsPerPage: 20,
                    maxSize: 10
                },
                data: {
                    Limit: 20,
                    Offset: 0,
                    Filter: [{
                        Appointment: {
                            Status: null,
                            Enable:'Y'
                        }},{
                        TelehealthAppointment: {
                            Type: 'WAA'
                        }
                    }],
                    Search: [{
                        PatientAppointment: {
                            FullName: null
                        }
                    }, {
                        Doctor: {
                            FullName: null
                        }
                    }],
                    Range: [{
                        Appointment: {
                            CreatedDate: [null, null],
                            FromTime: [null, null]
                        }
                    }],
                    Order:[{
                        Appointment:{
                            CreatedDate:'DESC'
                        }
                    }]
                },
                listWaapointment: null,
                toggle: true
            };
            scope.toggleFilter = function() {
                scope.info.toggle = scope.info.toggle === false ? true : false;
            };
            scope.WAAppointmentDetail = function(UID) {
                o.loadingPage(true);
                WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
                    console.log('responseData',data);
                    o.loadingPage(false);
                    $modal.open({
                        templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
                        controller: 'WAAppointmentListDetailCtrl',
                        windowClass: 'app-modal-window',
                        resolve: {
                            data: function() {
                                return data.data;
                            }
                        }
                    })
                    .result.then(function(responseData) {
                        if (responseData == 'success') {
                            scope.LoadData();
                        };
                    }, function(data) {})
                },function (error) {
                    o.loadingPage(false);
                    toastr.error("Select error!", "error");
                })

            };
            scope.LoadData = function() {
                WAAppointmentService.loadListWAAppointment(scope.info.data).then(function(data) {
                    scope.info.listWaapointment = data;
                });
            };
            scope.LoadData();
            scope.reloadData = function() {
                scope.info.data.Offset = (scope.info.paging.currentPage - 1) * scope.info.paging.itemsPerPage;
                (scope.info.data.Search[0].PatientAppointment.FullName !== "") ? scope.info.data.Search[0].PatientAppointment.FullName: scope.info.data.Search[0].PatientAppointment.FullName = null;
                (scope.info.data.Search[1].Doctor.FullName !== "") ? scope.info.data.Search[1].Doctor.FullName: scope.info.data.Search[1].Doctor.FullName = null;
                (scope.fromCreateDate && scope.fromCreateDate !== null) ? scope.info.data.Range[0].Appointment.CreatedDate[0] = moment(scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD Z'): scope.info.data.Range[0].Appointment.CreatedDate[0] = null;
                (scope.toCreateDate && scope.toCreateDate !== null) ? scope.info.data.Range[0].Appointment.CreatedDate[1] = moment(scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD Z'): scope.info.data.Range[0].Appointment.CreatedDate[1] = null;
                (scope.starFromTime && scope.starFromTime !== null) ? scope.info.data.Range[0].Appointment.FromTime[0] = moment(scope.starFromTime, 'DD/MM/YYYY').format('YYYY-MM-DD Z'): scope.info.data.Range[0].Appointment.FromTime[1] = null;
                (scope.endFromTime && scope.endFromTime !== null) ? scope.info.data.Range[0].Appointment.FromTime[1] = moment(scope.endFromTime, 'DD/MM/YYYY').format('YYYY-MM-DD Z'): scope.info.data.Range[0].Appointment.FromTime[1] = null;
                console.log('scope.info.data', scope.info.data);
                scope.LoadData();
            }
        }
    };
})