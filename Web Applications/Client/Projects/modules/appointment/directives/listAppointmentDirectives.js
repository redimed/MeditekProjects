var app = angular.module('app.authentication.appointment.directives.listAppoint', []);
app.directive('listAppointment', function(AppointmentService, $modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/appointment/directives/templates/listAppointment.html",
        link: function(scope, $state) {
            var Init = function() {
                scope.searchObject = {
                    Limit: 20,
                    Offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC',
                            FromTime: null
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
                    }]
                };
                scope.searchObjectMap = angular.copy(scope.searchObject);
                scope.load();
            };

            scope.typeSubmitDate = 'DESC';
            scope.typeAppointmentDate = 'DESC';
            scope.typeSubmitDateOther = null;
            scope.typeAppointmentOther = null;

            scope.sortData = function(Name, Type) {
                scope.searchObjectMap.Order = [];
                var orderTemp = {};
                orderTemp[Name] = Type;
                scope.searchObjectMap.Order.push({
                    Appointment: orderTemp
                });
                scope.load()
            };
            //set page
            scope.SetPage = function() {
                scope.searchObjectMap.Offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.Limit;
                scope.load();
            };
            scope.parseTime = function(data) {
                if (data.Range[0].Appointment.CreatedDate[0] !== null && data.Range[0].Appointment.CreatedDate[0] !== undefined) {
                    data.Range[0].Appointment.CreatedDate[0] = moment(data.Range[0].Appointment.CreatedDate[0]).format('YYYY-MM-DD Z');
                }
                if (data.Range[0].Appointment.CreatedDate[1] !== null && data.Range[0].Appointment.CreatedDate[1] !== undefined) {
                    data.Range[0].Appointment.CreatedDate[1] = moment(data.Range[0].Appointment.CreatedDate[1]).format('YYYY-MM-DD Z');
                }
                if (data.Range[0].Appointment.FromTime[0] !== null && data.Range[0].Appointment.FromTime[0] !== undefined) {
                    data.Range[0].Appointment.FromTime[0] = moment(data.Range[0].Appointment.FromTime[0]).format('YYYY-MM-DD Z');
                }
                if (data.Range[0].Appointment.FromTime[1] !== null && data.Range[0].Appointment.FromTime[1] !== undefined) {
                    data.Range[0].Appointment.FromTime[1] = moment(data.Range[0].Appointment.FromTime[1]).format('YYYY-MM-DD Z');
                }
            }

            scope.load = function() {
                scope.searchObjectMapTemp = angular.copy(scope.searchObjectMap)
                scope.parseTime(scope.searchObjectMapTemp)
                AppointmentService.loadListAppointment(scope.searchObjectMapTemp).then(function(response) {
                    scope.appointments = response.rows;
                    scope.CountRow = response.count
                });
            }
            Init();
            scope.toggle = true;
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };


            scope.openAppointmentModal = function(UID) {
                var data = []
                var modalInstance
                AppointmentService.getDetailApppointment(UID).then(function(response) {
                    data = response.data
                    modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'modules/appointment/views/appointmentListModal.html',
                        controller: 'appointmentListModalCtrl',
                        windowClass: 'app-modal-window',
                        //size: 'lg',
                        resolve: {
                            getid: function() {
                                return data;
                            }
                        }
                    });

                    modalInstance.result.then(function(responseData) {
                        if (responseData == 'success') {
                            scope.infoAppointment = {
                                patient: null,
                                doctor: null,
                                submit_from_date: null,
                                submit_to_date: null,
                                appointment_from_date: null,
                                appointment_to_date: null
                            }
                            scope.load()
                        };
                    }, function(data) {})

                })
            };

        }
    };
})
