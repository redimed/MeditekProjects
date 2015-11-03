var app = angular.module('app.authentication.WAAppointment.directives.listWAAppoint', []);
app.directive('listWaapointment', function(WAAppointmentService, $modal, $cookies) {
    return {
        restrict: 'E',
        templateUrl: "modules/WAAppointment/directives/templates/listWAApointment.html",
        link: function(scope) {
            scope.info = {
                apptStatus:{
                    Approved:WAConstant.apptStatus.Approved,
                    Calling:WAConstant.apptStatus.Calling,
                    Watting:WAConstant.apptStatus.Watting,
                    Cancelled:WAConstant.apptStatus.Cancelled,
                    Finish:WAConstant.apptStatus.Finish
                },
                paging: {
                    currentPage:1,
                    itemsPerPage:2,
                    maxSize:10
                },
                data:{
                    Limit:2,
                    Offset:0,
                    Filter:[{
                        Appointment:{
                            Status:null
                        },

                    }],
                    Search:[{
                        PatientAppointment:{
                            FullName:null
                        }
                    },
                    {
                        Doctor:{
                            FullName:null
                        }
                    }],
                    Range:[{
                        Appointment:{
                            CreatedDate:[null,null],
                            FromTime:[null,null]
                        }
                    }]
                },
                listWaapointment:null,
                toggle:true
            };
            scope.toggleFilter = function() {
                scope.info.toggle = scope.info.toggle === false ? true : false;
            };
            scope.WAAppointmentDetail = function() {
                $modal.open({
                    templateUrl: 'modules/WAAppointment/views/WAAppointmentListDetail.html',
                    controller: 'WAAppointmentListDetailCtrl',
                    windowClass: 'app-modal-window',
                })
            };
            scope.LoadData = function () {
                WAAppointmentService.loadListWAAppointment(scope.info.data).then(function (data) {
                    scope.info.listWaapointment = data;
                    console.log("listWaapointment",scope.info.listWaapointment);
                });
            };
            scope.LoadData();
            scope.changePage = function (numberPage) {
                scope.info.data.Offset = (numberPage -1)*scope.info.paging.itemsPerPage;
                console.log('scope.info.data',scope.info.data);
                scope.LoadData();
            }
        }
    };
})
