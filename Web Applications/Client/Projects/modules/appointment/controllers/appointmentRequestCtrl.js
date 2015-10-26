var app = angular.module('app.authentication.appointment.request.controller', [
    'app.authentication.appointment.request.modal.controller'
]);

app.controller('appointmentRequestCtrl', function($scope, $cookies, AppointmentService, $state, FileUploader, $modal, $interval) {

    $scope.doctors = [];
    $scope.details = [];

    $scope.requestInfo = {
        RequestDate: null,
        TelehealthAppointment: {
            RefDate: null,
            RefDurationOfReferal: null,
            PatientAppointment: {
                FirstName: null,
                LastName: null,
                DOB: null,
                Email: null,
                PhoneNumber: null,
                Address1: null,
                Suburb: null,
                Postcode: null,
                HomePhoneNumber: null
            },
            ExaminationRequired: {
                Private: null,
                Public: null,
                DVA: null,
                WorkersComp: null,
                MVIT: null
            }
        },
        UserInfo: {
            UID: $cookies.getObject('userInfo').UID
        },
        FileUploads: []
    }

    $scope.checkElectiveOther = false;
    $scope.checkLacerationsOther = false;
    $scope.checkPNSOther = false;

    $scope.checkboxOther = function() {
        if ($scope.checkLacerationsOther == false) {
            $scope.details[1].data[5].value = null;
        }
        if ($scope.checkElectiveOther == false) {
            $scope.details[2].data[2].value = null;
        }
        if ($scope.checkPNSOther == false) {
            $scope.details[4].data[4].value = null;
        }
    };


    $scope.SubmitRequest = function() {
         $scope.laddaLoadingBar = true;
        ((uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.sendRequestAppointment());
    }


    $scope.sendRequestAppointment = function() {

        console.log($scope.requestInfo.FileUploads);
        $scope.requestInfo.RequestDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss Z");
        $scope.requestInfo.TelehealthAppointment.RefDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss Z");
        $scope.requestInfo.TelehealthAppointment.PatientAppointment.DOB = moment($scope.patientAppointmentDOBTemp, "DD-MM-YYYY").format("YYYY-MM-DD hh:mm:ss Z");

        $scope.requestInfo.TelehealthAppointment.PreferredPractitioner = [];
        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
        _.forEach($scope.doctors, function(item) {
            if (item != undefined || item != null) {
                var data = {
                    Name: item
                }
                $scope.requestInfo.TelehealthAppointment.PreferredPractitioner.push(data);
            };
        });

        _.forEach($scope.details, function(item) {
            _.forEach(item.data, function(p) {
                if (p.value) {
                    var data = {
                        Section: "Clinical Details",
                        Category: "Telehealth Appointment",
                        Type: item.type,
                        Name: p.name,
                        Value: p.value,
                        ClinicalNote: ($scope.ClinicalNote) ? $scope.ClinicalNote : null,
                        Description: null
                    }
                    $scope.requestInfo.TelehealthAppointment.ClinicalDetails.push(data);
                }
            })
        });
        console.log('data', $scope.requestInfo);
        AppointmentService.SendRequest($scope.requestInfo).then(function(data) {
            $scope.laddaLoadingBar = false;
            swal({
                title: "Success",
                text: "Send Request Successfully!",
                type: "success",
                showLoaderOnConfirm: true,
            }, function() {
                $state.go("authentication.appointment.list");
            });
        }, function(error) {
            $scope.laddaLoadingBar = false;
            swal({
                title: "Error",
                text: "Send Request Error!",
                type: "error"
            });
        });
    };

    $scope.SendRequestUploadFile = function() {
        for (var i = 0; i < uploader.queue.length; i++) {
            console.log(' uploader.queue', uploader.queue);
            var item = uploader.queue[i];
            item.formData[i] = {};
            item.formData[i].userUID = $cookies.getObject('userInfo').UID;
            item.formData[i].fileType = 'MedicalImage';
        };
        uploader.uploadAll();
    }


    var uploader = $scope.uploader = new FileUploader({
        // url: 'http://testapp.redimed.com.au:3005/api/uploadFile',
        headers:{Authorization:('Bearer '+$cookies.get("token"))},
        url: 'http://telehealthvietnam.com.vn:3005/api/uploadFile',
        alias: 'uploadFile'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        if (response.status == 'success') {
            $scope.requestInfo.FileUploads.push({
                UID: response.fileUID
            });
        };
    };
    uploader.onCompleteAll = function() {
        $scope.sendRequestAppointment();
    };

    console.info('uploader', uploader);

    $scope.ModalBodyPart = function() {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'modules/appointment/views/appointmentRequestModal.html',
            controller: 'appointmentRequestModalCtrl',
            //windowClass : 'app-modal-window',
            size: 'lg',
            resolve: {
                getid: function() {
                    return true;
                }
            }
        });
    };
});
