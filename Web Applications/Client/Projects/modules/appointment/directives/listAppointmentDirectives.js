var app = angular.module('app.authentication.appointment.directives.listAppoint', []);
app.directive('listAppointment', function(AppointmentService, $modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/appointment/directives/templates/listAppointment.html",
        link: function(scope, $state) {
            scope.currentPage = 1;
            scope.numPerPage = 20;
            scope.maxSize = 10;

            scope.typeSubmitDate = 'DESC';
            scope.typeAppointmentDate = 'DESC';
            scope.typeSubmitDateOther = null;
            scope.typeAppointmentOther = null;
            scope.sortDataTable = function(Name,Type){
                if (Name === 'SubmitDate') {
                  Type == 'DESC' ? scope.typeSubmitDate = 'ASC' : scope.typeSubmitDate = 'DESC'; 
                   scope.typeAppointmentDateOther = null; 
                   scope.typeSubmitDateOther = scope.typeSubmitDate;
                   scope.filter()
                };
                if(Name === 'AppointmentDate') {
                  Type == 'DESC' ? scope.typeAppointmentDate = 'ASC' : scope.typeAppointmentDate = 'DESC'; 
                  scope.typeSubmitDateOther = null;
                  scope.typeAppointmentDateOther = scope.typeAppointmentDate;
                  scope.filter()
                };
                
            };

            scope.filteredTodos = [];
            var data = {
                Order: [{
                    Appointment: {
                        RequestDate: 'DESC'
                    }
                }]
            };
            scope.infoAppointment = {
                patient: null,
                doctor: null,
                submit_from_date: null,
                submit_to_date: null,
                appointment_from_date: null,
                appointment_to_date: null
            }
            scope.load = function() {
                AppointmentService.loadListAppointment(data).then(function(response) {
                    
                    scope.filteredTodos = response.rows;
                    scope.appointments = response.rows;
                    scope.$watch("currentPage + numPerPage", function() {
                        var begin = ((scope.currentPage - 1) * scope.numPerPage),
                            end = begin + scope.numPerPage;
                        scope.appointments = scope.filteredTodos.slice(begin, end);
                    });
                });
            }
            scope.load()
            scope.filter = function() {

                var submit_from_date = null
                var submit_to_date = null
                var appointment_from_date = null
                var appointment_to_date = null
                if (scope.infoAppointment.submit_from_date !== null) {
                    submit_from_date = moment(scope.infoAppointment.submit_from_date).format("YYYY-MM-DD Z");
                }
                if (scope.infoAppointment.submit_to_date !== null) {
                    submit_to_date = moment(scope.infoAppointment.submit_to_date).format("YYYY-MM-DD Z");
                }
                if (scope.infoAppointment.appointment_from_date) {
                    appointment_from_date = moment(scope.infoAppointment.appointment_from_date).format("YYYY-MM-DD Z");
                }
                if (scope.infoAppointment.appointment_to_date !== null) {
                    appointment_to_date = moment(scope.infoAppointment.appointment_to_date).format("YYYY-MM-DD Z");
                };
                var postData = {
                        limit: 100,
                        Order: [{
                            Appointment: {
                               RequestDate: scope.typeSubmitDateOther,
                               FromTime:scope.typeAppointmentDateOther
                            }
                        }],
                        Search: [{
                            PatientAppointment: {
                                FullName: scope.infoAppointment.patient
                            }
                        }, {
                            Doctor: {
                                FullName: scope.infoAppointment.doctor
                            }
                        }],
                        Range: [{
                            Appointment: {
                                RequestDate: [submit_from_date, submit_to_date],
                                FromTime: [appointment_from_date, appointment_to_date]
                            }
                        }]
                    }
                    //console.log(postData)
                AppointmentService.loadListAppointment(postData).then(function(response) {
                    scope.filteredTodos = response.rows;
                    scope.appointments = response.rows;
                    scope.$watch("currentPage + numPerPage", function() {
                        var begin = ((scope.currentPage - 1) * scope.numPerPage),
                            end = begin + scope.numPerPage;
                        scope.appointments = scope.filteredTodos.slice(begin, end);
                    });

                    scope.Correspondence = 1
                });
            }
            scope.toggle = true;
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };


            scope.openAppointmentModal = function(UID) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'modules/appointment/views/appointmentListModal.html',
                    controller: 'appointmentListModalCtrl',
                    windowClass: 'app-modal-window',
                    //size: 'lg',
                    resolve: {
                        getid: function() {
                            return UID;
                        }
                    }
                });

                modalInstance.result.then(function(responseData) {
                    if (responseData == 'success') {
                        scope.load()
                    };
                }, function(data) {})
            };

        }
    };
})
