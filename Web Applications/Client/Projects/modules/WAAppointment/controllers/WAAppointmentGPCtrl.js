var app = angular.module('app.authentication.WAAppointment.GP.controller', []);

app.controller('WAAppointmentGPCtrl', function(WAAppointmentService, $scope, $cookies, AppointmentService, $state, FileUploader, $modal, $interval, AuthenticationService) {
    $scope.ListContry = [];
    $scope.loadListContry = function() {
        AuthenticationService.getListCountry().then(function(response) {
            $scope.ListContry = response.data;
        })
    }
    $scope.loadListContry();
    var ClinicalDetailsTemp = [];
    $scope.requestInfo = {
        RequestDate: null,
        SiteID: 1,
        TelehealthAppointment: {
            PreferredPractitioner: [{
                Speciality: ''
            }],
            PatientAppointment: {

            }
        }

    };
    $scope.showData = {
        GenderOther: null
    };
    $scope.listDoctor = [];
    $scope.loadAllDoctor = function() {
        AppointmentService.ListDoctor().then(function(data) {
            $scope.listDoctor = data;
        });

    };

    $scope.loadAllDoctor();
    $scope.sendRequestAppointment = function() {

        if ($scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender === 'Other') {
            $scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender = $scope.showData.GenderOther;
        }
        for (var key in $scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
            var newkey = key.split("__").join(" ");
            var res = newkey.split(".");
            var object = {
                Section: res[0],
                Category: res[1],
                Type: res[2],
                Name: res[3],
                Value: $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value,
                FileUploads: $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads
            };
            var isExist = false;

            ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                if (valueTemp.Section == object.Section &&
                    valueTemp.Category == object.Category &&
                    valueTemp.Type == object.Type &&
                    valueTemp.Name == object.Name) {
                    isExist = true;
                };
            });
            if (!isExist) {
                ClinicalDetailsTemp.push(object);
            };
        };
        var countCliniDetail = 0;
        ClinicalDetailsTemp.forEach(function(value, key) {
            if (value.Value != 'N' && value.Value != null) {
                countCliniDetail++;
            };
        });
        if (countCliniDetail == 0) {
            ClinicalDetailsTemp = [];
        };
        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp;
        $scope.requestInfo.RequestDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
        
        WAAppointmentService.RequestWAApointment($scope.requestInfo).then(function(response) {
            if (response == 'success') {
                swal({
                    title: "Success",
                    text: "Send Request Successfully!",
                    type: "success",
                    showLoaderOnConfirm: true,
                }, function() {
                    $state.go("authentication.WAAppointment.list");
                });
            };
        });
    };
    $scope.Skin_cancer_Others = false;
    $scope.SendRequestUploadFile = function() {
        for (var i = 0; i < uploader.queue.length; i++) {
            var item = uploader.queue[i];
            item.formData[0]["userUID"] = $cookies.getObject('userInfo').UID;
            item.formData[0]["fileType"] = 'MedicalImage';
        };
        uploader.uploadAll();
    };


    var uploader = $scope.uploader = new FileUploader({
        url: o.const.uploadFileUrl,
        headers: {
            Authorization: ('Bearer ' + $cookies.get("token")),
            systemtype: 'WEB'
        },
        withCredentials: true,
        alias: 'uploadFile'
    });
    // FILTERS
    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 100;
        }
    });
    uploader.yourMethod = function() {
        alert('12');
    };

    $scope.ClickUploader = function(Type) {
            angular.element('#' + Type).click();
            uploader.onAfterAddingFile = function(fileItem) {
                var position = fileItem.formData.length
                fileItem.formData.push({
                    fileTypeClinical: Type
                });
            };
        };
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
    uploader.clearQueue = function(type) {
        var queueTemp = angular.copy(uploader.queue);
        for (var i = uploader.queue.length - 1; i >= 0; i--) {
            if (uploader.queue[i].formData[0].fileTypeClinical == type) {
                uploader.queue.splice(i, 1);
            };
        };
    };
    $scope.ChangeCheckSkinCancer = function(type, value) {
        if (!value) {
            var key = 'Clinical__Details.Telehealth__WAAppointment.Skin__cancer.' + type;
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
                if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key]) {
                    $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key] = {};
                };
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value = '';
            };
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value = '';
        };
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        if (response.status == 'success') {
            var key = 'Clinical__Details.Telehealth__WAAppointment.Notes.' + fileItem.formData[0].fileTypeClinical;
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
                if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key]) {
                    $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key] = {};
                };
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads = [];
            };
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads.push({
                UID: response.fileUID
            })
        };
    };
    uploader.onCompleteAll = function() {
        $scope.sendRequestAppointment();
    };
    $scope.ChangeReferrer = function() {
        if ($scope.requestInfo.TelehealthAppointment.WAAppointment.IsUsualGP == 'Y') {
            $scope.requestInfo.TelehealthAppointment.WAAppointment.UsualGPName = null;
            $scope.requestInfo.TelehealthAppointment.WAAppointment.UsualGPContactNumber = null;
            $scope.requestInfo.TelehealthAppointment.WAAppointment.UsualGPFaxNumber = null;
        };
    };

    $scope.Submit = function() {
        $scope.laddaLoadingBar = true;
        swal({
                title: "Are you sure ?",
                text: "Send Request WAAppointment",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            },
            function() {
                ((uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.sendRequestAppointment());
            });

    };
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
