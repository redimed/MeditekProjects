var app = angular.module('app.authentication.booking.scheduler.create.controller', []);

app.controller('schedulerCreateCtrl', function($scope, BookingService, RosterService, event, start, end, PatientService, $modal, $uibModal, $timeout, $modalInstance, toastr) {
    $modalInstance.rendered.then(function() {       
        App.initAjax();
        ComponentsDateTimePickers.init();
    });

    $scope.items = [
        { field: "FirstName", name: "First Name" },
        { field: "LastName", name: "Last Name" },
        { field: "UserAccount", name: "Mobile" },
    ];
    $scope.patient = {
        runIfSuccess: function(data) {
            $timeout(function() {
                $scope.formData.Patient = data;
            }, 0);
        },
        runIfClose: function() {
            $modalInstance.close();
        }
    };

    /*function getListService() {
        RosterService.GetListService()
            .then(function(response) {
                $scope.listServices = response.data;
            }, function(error) {

            })
    }*/

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
    console.log("event ",event);
    $scope.formData = {
        service: event.Services[0],
        site: event.Sites[0],
        fromTime: moment(start).format('HH:mm'),
        toTime: moment(end).format('HH:mm'),
        date: moment(start).format('DD/MM/YYYY'),
        Doctor: event.UserAccounts[0].Doctor,
        Patient: null,
        type: 'Onsite'
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
            var fromTime = appendFullCalendarDateTime(start, $scope.formData.fromTime);
            var toTime = appendFullCalendarDateTime(start, $scope.formData.toTime);
            var type = $scope.formData.type;
            var zone = moment().format('Z');
            var requestDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + " " + zone;
            var serviceUID = $scope.formData.service.UID;
            var siteUID = $scope.formData.site.UID;
            var DoctorUID = event.UserAccounts[0].Doctor.UID;
            var PatientUID = $scope.formData.Patient.UID;

            if (PatientUID === '')
                toastr.error('You must choose Patient');
            else {
                var postData = {
                    Appointment: {
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

                BookingService.CreateBooking(postData)
                    .then(function(response) {
                        toastr.success('Create Booking Successfully');
                        $modalInstance.close();
                    }, function(error) {
                        if (typeof error.data !== 'undefined') {
                            var type = error.data.status;
                            switch (type) {
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
    //getListService();
});

/*Thao*/
app.controller('schedulerCreateDirectiveCtrl', function($scope, item, BookingService, RosterService, event, start, end, PatientService, $modal, $uibModal, $timeout, $modalInstance, toastr, type, time, $stateParams, $state) {
    $scope.item = item;     
    $scope.time = time;
    $scope.formData = {};
    $modalInstance.rendered.then(function() {       
        App.initAjax();
        ComponentsDateTimePickers.init();
    });

    $scope.items = [
        { field: "FirstName", name: "First Name" },
        { field: "LastName", name: "Last Name" },
        { field: "UserAccount", name: "Mobile" },
    ];
    $scope.formData = {};
    $scope.patient = {
        runIfSuccess: function(data) {
            $timeout(function() {
                $scope.formData.Patient = data;
            }, 0);
        },
        runIfClose: function() {
            $modalInstance.close();
        }
    };


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
    // $scope.formData = {
    $scope.formData.service = event.Services[0];
    $scope.formData.site = event.Sites[0];
    $scope.formData.fromTime = moment(start).format('HH:mm'),
    $scope.formData.toTime = moment(end).format('HH:mm');
    $scope.formData.apptDate = moment(start).format('DD/MM/YYYY');//moment(start).format('DD/MM/YYYY'),
    $scope.formData.Doctor = event.UserAccounts[0].Doctor;
    $scope.formData.Patient = item;
    $scope.formData.type = type;
    // };
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

    $scope.selectDoctor = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modules/booking/views/bookingSelectDoctor.html',
            size: "lg",
            resolve:{
                
            },
            controller: "bookingSelectDoctorCtrl",
        });
        modalInstance.result.then(function(result) {
           console.log(result);
           if (result) {
                $scope.formData.Doctor = result;
           };
        })
    }

    $scope.submit = function() {
        var accept = true;
        o.loadingPage(true);
        var fromTimeParse = convertToTime24($scope.formData.fromTime);
        var toTimeParse = convertToTime24($scope.formData.toTime);
        if (fromTimeParse >= toTimeParse) {
            toastr.error('From Time must be smaller than To Time !!!');
            accept = false;
            o.loadingPage(false);
        } else if (PatientUID === '') {
            toastr.error('You must choose Patient');
            accept = false;
            o.loadingPage(false);
        } else {
            var apptDate = moment($scope.formData.apptDate,"DD/MM/YYYY")
            var fromTime = appendFullCalendarDateTime(apptDate , $scope.formData.fromTime);
            var toTime = appendFullCalendarDateTime(apptDate , $scope.formData.toTime);
            var type = $scope.formData.type;
            var zone = moment().format('Z');
            var requestDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + " " + zone;
            var serviceUID = $scope.formData.service.UID;
            var siteUID = $scope.formData.site.UID;
            // var DoctorUID = event.UserAccounts[0].Doctor.UID;
            var DoctorUID = $scope.formData.Doctor.UID;
            var PatientUID = $scope.formData.Patient.UID;
            //var UID = data.UID;

            if (PatientUID === '')
                {
                    toastr.error('You must choose Patient');
                    o.loadingPage(false);
                }
            else {
                var postData = {
                    "Appointment": {
                        "FromTime": fromTime,
                        "ToTime": toTime
                    },
                    "Doctor": {
                        "UID": DoctorUID
                    }
                }
                BookingService.CheckTimeBooking(postData)
                .then(function(response){                    
                    var postData = {
                        Appointment: {
                            UID: $stateParams.UID,
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
                BookingService.CreateBooking(postData)
                .then(function(response) {
                    o.loadingPage(false);
                    toastr.success('Update Booking Successfully');
                    window.location.reload();
                }, function(error) {
                    o.loadingPage(false);
                    if (typeof error.data !== 'undefined') {
                        var type = error.data.status;
                        switch (type) {
                            case 'withoutRoster':
                                toastr.error('Booking Appointment Time Wrong !!!');
                                break;
                        }
                    }
                })
                }, function(error){
                    if (error && error.data && error.data.status == "withoutRoster") {
                        swal({
                            title: "Warning",
                            text: "Do you want Booking Appointment without Roster!!",
                            type: "warning",
                            showCancelButton: true,
                            showLoaderOnConfirm: true,
                        }, function() {
                            var postData = {
                                    Appointment: {
                                        UID: $stateParams.UID,
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
                                console.log("postData", postData);
                            BookingService.CreateBooking(postData)
                            .then(function(response) {
                                o.loadingPage(false);
                                toastr.success('Update Booking Successfully');
                                window.location.reload();
                            }, function(error) {
                                o.loadingPage(false);
                                if (typeof error.data !== 'undefined') {
                                    var type = error.data.status;
                                    switch (type) {
                                        case 'withoutRoster':
                                            toastr.error('Booking Appointment Time Wrong !!!');
                                            break;
                                    }
                                }
                            })
                        });
                    }
                })
            }
        }
    };

    //INIT
    getListSite();
    getListService();
});
/*Thao*/
