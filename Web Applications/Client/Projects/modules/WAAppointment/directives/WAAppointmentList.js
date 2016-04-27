var app = angular.module('app.authentication.WAAppointment.directives.listWAAppoint', []);
app.directive('listWaapointment', function(WAAppointmentService, $modal, $cookies, toastr, $state) {
    return {
        scope: {
            data: "="
        },
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
                            Enable: 'Y',
                            Type: null
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
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC'
                        }
                    }]
                },
                listWaapointment: null,
                toggle: false
            };
            scope.WAAppointmentDetail = function(UID, AppointmentType) {
                if (AppointmentType == 'Onsite') {
                    $state.go("authentication.onsite.appointment", { UID: UID })
                } else {
                    $state.go("authentication.WAAppointment.detail", { UID: UID })
                };

            };
            scope.LoadData = function() {
                o.loadingPage(true);
                WAAppointmentService.loadListWAAppointment(scope.info.data).then(function(data) {
                    console.log("data ne ",data);
                    for(var i = 0; i < data.rows.length; i++) {
                        console.log("code ",data.rows[i].Code);
                        if(_.isEmpty(data.rows[i].TelehealthAppointment) == false) {
                            console.log("truong hop 1");
                            if(_.isEmpty(data.rows[i].TelehealthAppointment.PatientAppointment) == false) {
                                console.log(data.rows[i].Patients);
                                if(data.rows[i].Patients.length == 0){
                                    data.rows[i].ishavePatientAppointment = true;
                                    data.rows[i].Patients.push(data.rows[i].TelehealthAppointment.PatientAppointment);
                                }
                            }
                        }
                        else if(_.isEmpty(data.rows[i].PatientAppointments) == false) {
                            console.log("truong hop 2");
                            if(data.rows[i].Patients.length == 0){
                                data.rows[i].ishavePatientAppointment = true;
                                console.log("PatientAppointments ",data.rows[i].PatientAppointments);
                                data.rows[i].Patients.push(data.rows[i].PatientAppointments[0]);
                                console.log("Patients ",data.rows[i].Patients);
                            }
                        }
                    }
                    scope.info.listWaapointment = data;
                    o.loadingPage(false);
                });
            };
            scope.LoadData();
            scope.reloadData = function() {
                scope.info.data.Offset = (scope.info.paging.currentPage - 1) * scope.info.paging.itemsPerPage;
                (scope.info.data.Search[0].PatientAppointment.FullName !== null && scope.info.data.Search[0].PatientAppointment.FullName !== undefined) ? scope.info.data.Search[0].PatientAppointment.FullName: scope.info.data.Search[0].PatientAppointment.FullName = null;
                (scope.info.data.Search[1].Doctor.FullName !== "" && scope.info.data.Search[1].Doctor.FullName !== undefined) ? scope.info.data.Search[1].Doctor.FullName: scope.info.data.Search[1].Doctor.FullName = null;
                (scope.fromCreateDate && scope.fromCreateDate !== null) ? scope.info.data.Range[0].Appointment.CreatedDate[0] = moment(scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Range[0].Appointment.CreatedDate[0] = null;
                (scope.toCreateDate && scope.toCreateDate !== null) ? scope.info.data.Range[0].Appointment.CreatedDate[1] = moment(scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Range[0].Appointment.CreatedDate[1] = null;
                (scope.starFromTime && scope.starFromTime !== null) ? scope.info.data.Range[0].Appointment.FromTime[0] = moment(scope.starFromTime, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Range[0].Appointment.FromTime[1] = null;
                (scope.endFromTime && scope.endFromTime !== null) ? scope.info.data.Range[0].Appointment.FromTime[1] = moment(scope.endFromTime, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): scope.info.data.Range[0].Appointment.FromTime[1] = null;
                console.log('scope.info.data', scope.info.data);
                scope.LoadData();
            }
        }
    };
})
