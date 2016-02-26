var app = angular.module('app.authentication.booking.scheduler.edit.controller', []);

app.controller('schedulerEditCtrl', function($scope, BookingService, RosterService, data, PatientService, $modal, $uibModal, $timeout, $modalInstance, toastr) {
    $modalInstance.rendered.then(function() {
        App.initAjax();
        ComponentsDateTimePickers.init();
    });

    $scope.choosePatientDialog = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: '../../modules/appointment/views/appointmentSelectPatientModal.html',
            controller: function($scope, $modalInstance) {
                $scope.patient = {
                    runIfSuccess: function(data) {
                        $modalInstance.close({
                            status: 'success',
                            data: data
                        });
                    },
                    runIfClose: function() {
                        $modalInstance.close();
                    }
                };
            },
            windowClass: 'app-modal-window',
            resolve: {
                patientInfo: function() {
                    return true;
                }
            }
        });
        modalInstance.result.then(function(data) {
            $scope.formData.Patient = data.data;
        });
    }

    function getListService() {
        RosterService.GetListService()
            .then(function(response) {
                $scope.listServices = response.data;
            }, function(error) {

            })
    }

    function getListSite() {
        RosterService.GetListSite()
            .then(function(response) {
                $scope.listSites = response.data;
            }, function(error) {

            })
    }

    $scope.listTypes = [{
        code: 'Onsite',
        name: 'Onsite'
    }, {
        code: 'Telehealth',
        name: 'Telehealth'
    }];
    $scope.formData = {
        service: data.Services[0],
        site: data.Site,
        fromTime: moment(data.FromTime).format('HH:mm'),
        toTime: moment(data.ToTime).format('HH:mm'),
        date: moment(data.FromTime).format('DD/MM/YYYY'),
        Doctor: data.Doctors[0],
        Patient: data.Patients[0],
        type: data.Type
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    function appendTime(time) {
        return (time < 10) ? '0' + time : time;
    }

    function appendFullCalendarDateTime(date, time) {
        var split_time = time.split(':');
        var hour = appendTime(split_time[0]);
        var minute = split_time[1];
        var zone = moment().format('Z');
        return moment(date).format('YYYY-MM-DD') + ' ' + hour + ':' + minute + ':00 ' + zone;
    }

    function convertToTimeZone(time) {
        var split_time = time.split('/');
        return moment(split_time[2] + '-' + split_time[1] + '-' + split_time[0]).format('YYYY-MM-DD HH:mm:ss Z');
    }

    function convertToTime24(timeString) {
        var split = timeString.split(':');
        return parseInt(split[0] + split[1]);
    };

    $scope.submit = function() {
        var accept = true;

        var fromTimeParse = convertToTime24($scope.formData.fromTime);
        var toTimeParse = convertToTime24($scope.formData.toTime);
        if (fromTimeParse >= toTimeParse) {
            toastr.error('From Time must be smaller than To Time !!!');
            accept = false;
        } else if (PatientUID === '') {
            toastr.error('You must choose Patient');
            accept = false;
        } else {

            var fromTime = appendFullCalendarDateTime(data.FromTime, $scope.formData.fromTime);
            var toTime = appendFullCalendarDateTime(data.FromTime, $scope.formData.toTime);
            var type = $scope.formData.type;
            var requestDate = moment(data.FromTime).format('YYYY-MM-DD HH:mm:ss Z');
            var serviceUID = $scope.formData.service.UID;
            var siteUID = $scope.formData.site.UID;
            var DoctorUID = $scope.formData.Doctor.UID;
            var PatientUID = $scope.formData.Patient.UID;
            var UID = data.UID;

            if (PatientUID === '')
                toastr.error('You must choose Patient');
            else {
                var postData = {
                    Appointment: {
                        UID: UID,
                        FromTime: fromTime,
                        ToTime: toTime,
                        Type: type,
                        RequestDate: requestDate
                    },
                    Service: {
                        UID: serviceUID
                    },
                    Site: {
                        UID: siteUID
                    },
                    Doctor: {
                        UID: DoctorUID
                    },
                    Patient: {
                        UID: PatientUID
                    }
                }

                BookingService.UpdateBooking(postData)
                    .then(function(response) {
                        toastr.success('Update Booking Successfully');
                        $modalInstance.close();
                    }, function(error) {
                        if(typeof error.data !== 'undefined'){
                            var type = error.data.status;
                            switch(type){
                                case 'withoutRoster':
                                    toastr.error('Booking Appointment Time Wrong !!!');
                                    break;
                            }
                        }
                    })
            }
        }
    };

    //INIT
    getListSite();
    getListService();
});
