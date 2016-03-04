var app = angular.module('app.authentication.consultation.directives.listAppoint', []);
app.directive('listAppoint', function(WAAppointmentService, $modal, $cookies, toastr, $state, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppoint.html",
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
                            Enable: 'Y',
                            CreatedDate: null,
                            FromTime:null
                        }
                    }, {
                        Patient: {
                            UID: null
                        }
                    }],
                    Search: [{
                        Patient: {
                            FullName: null
                        }
                    }],
                    Range: [{
                        Appointment: {
                            CreatedDate: [null, null],
                            FromTime: [null, null]
                        }
                    }],
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC'
                        }
                    }]
                },
                listWaapointment: null,
                toggle: false
            };
            if ($stateParams.roleid == 'roleid') {
                var today = new Date();
                scope.info.data.Filter[0].Appointment.FromTime = moment(today).format('YYYY-MM-DD 00:00:00 Z');
                //console.log(moment().add(1,'days'));
            }
            scope.toggleFilter = function() {
                scope.info.toggle = scope.info.toggle === false ? true : false;
            };
            scope.WAAppointmentDetail = function(UID) {
                o.loadingPage(true);
                WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
                    console.log('responseData', data);
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
                }, function(error) {
                    o.loadingPage(false);
                    toastr.error("Select error!", "error");
                })

            };
            scope.Detail = function(data) {
                var dataPost = {
                    UID: data.UID,
                    UIDPatient: (data.Patients.length == 0) ? 'e.x.ex' : data.Patients[0].UID
                };
                if (data.Patients.length !== 0) {
                    $state.go("authentication.consultation.detail", {
                        UID: dataPost.UID,
                        UIDPatient: dataPost.UIDPatient
                    });
                } else {
                    toastr.error('Please link Patients');
                };
            };

            scope.LoadData = function() {
                console.log(scope.info.data);
                WAAppointmentService.loadListWAAppointment(scope.info.data).then(function(data) {
                    console.log(data);
                    scope.info.listWaapointment = data;
                });
            };
            scope.LoadData();
            scope.reloadData = function() {
                scope.info.data.Offset = (scope.info.paging.currentPage - 1) * scope.info.paging.itemsPerPage;
                (scope.info.data.Search[0].Patient.FullName !== "") ? scope.info.data.Search[0].Patient.FullName: scope.info.data.Search[0].Patient.FullName = null;
                (scope.fromCreateDate && scope.fromCreateDate !== null) ? scope.info.data.Filter[0].Appointment.CreatedDate = moment(scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Filter[0].Appointment.CreatedDate = null;
                console.log('scope.info.data', scope.info.data);
                scope.LoadData();
            }
        }
    };
})
