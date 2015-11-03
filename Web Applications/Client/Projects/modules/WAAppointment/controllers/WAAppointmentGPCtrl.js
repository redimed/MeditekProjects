var app = angular.module('app.authentication.WAAppointment.GP.controller', []);

app.controller('WAAppointmentGPCtrl', function(WAAppointmentService, $scope, $cookies, AppointmentService, $state, FileUploader, $modal, $interval) {
    var ClinicalDetailsTemp = [];
    $scope.requestInfo = {
        RequestDate: moment().format('YYYY-MM-DD HH:mm:ss Z'),
        SiteID: 1,
        TelehealthAppointment: {
            PreferredPractitioner: [{
                Speciality: ''
            }],
            PatientAppointment : {

            }
        }

    }
    $scope.showData = {
        GenderOther : null
    }
    $scope.listDoctor = []
    $scope.loadAllDoctor = function() {
        AppointmentService.ListDoctor().then(function(data) {
            $scope.listDoctor = data;
        });

    }

    $scope.loadAllDoctor();
    $scope.sendRequestAppointment = function() {
        console.log($scope.requestInfo.TelehealthAppointment.ClinicalDetails)
        if ($scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender === 'Other') {
            $scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender = $scope.showData.GenderOther
        }
        
        for (var key in $scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
            var newkey = key.split("__").join(" ")
            var res = newkey.split(".");
            var object = {
                Section: res[0],
                Category: res[1],
                Type: res[2],
                Name: res[3],
                Value: $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value
            }
            var isExist = false
            
            ClinicalDetailsTemp.forEach(function(valueTemp, keyTemp) {
                if (valueTemp.Section == object.Section &&
                    valueTemp.Category == object.Category &&
                    valueTemp.Type == object.Type &&
                    valueTemp.Name == object.Name) {
                    isExist = true
                }
            })
            if (!isExist) {
                ClinicalDetailsTemp.push(object)
            };
        };
        var countCliniDetail = 0
        ClinicalDetailsTemp.forEach(function(value, key) {
            if (value.Value != 'N' && value.Value != null) {
                countCliniDetail++
            };
        })
        if (countCliniDetail == 0) {
            ClinicalDetailsTemp = []
        }
        console.log($scope.requestInfo)
        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp
        WAAppointmentService.RequestWAApointment($scope.requestInfo).then(function(response){
            console.log(response)
            alert('1')
        })
    }
    $scope.Skin_cancer_Others = false;
    $scope.info = {};
    $scope.click_other = function() {
        console.log($scope.info.txtSkin_cancer_Others)
            // $scope.Skin_cancer_Others = !$scope.Skin_cancer_Others;
            // $scope.txtSkin_cancer_Others = '';
    }

    $scope.SendRequestUploadFile = function() {
        for (var i = 0; i < uploader.queue.length; i++) {
            var item = uploader.queue[i];
            item.formData[0]["userUID"] = $cookies.getObject('userInfo').UID;
            item.formData[0]["fileType"] = 'MedicalImage';
        };
        uploader.uploadAll();
    }


     var uploader = $scope.uploader = new FileUploader({
        url: o.const.uploadFileUrl,
        headers:{Authorization:('Bearer '+$cookies.get("token"))},
        alias: 'uploadFile'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            return this.queue.length < 10;
        }
    });
    uploader.yourMethod = function() {
        alert('12')
    };
    
    $scope.ClickUploader = function(Type){ 
        angular.element('#'+Type).click();
        uploader.onAfterAddingFile = function(fileItem) {
            var position = fileItem.formData.length
            fileItem.formData.push({fileTypeClinical:Type})
        };
    }
    // CALLBACKS
    $scope.ClickRemoveAll = function(Type){
        //angular.element('#referralPresentinga').click();
         uploader.clearQueue = function(){
            console.log("clearQueue")
        }
    }

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
    uploader.clearQueue = function(type){
       var queueTemp = angular.copy(uploader.queue);
       for(var i = uploader.queue.length -1; i >= 0 ; i--){
            if(uploader.queue[i].formData[0].fileTypeClinical == type){
                uploader.queue.splice(i, 1);
            }
        }
    }
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        if (response.status == 'success') {
            var key = 'Clinical__Details.Telehealth__WAAppointment.Notes.'+fileItem.formData[0].fileTypeClinical;
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
                if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key]) {
                    $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key] = {};
                };
            };
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads = []
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads.push({UID:response.fileUID})
            console.log($scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads)
        };
    };
    uploader.onCompleteAll = function() {
        $scope.sendRequestAppointment();
    };
    console.info('uploader', uploader);
    $scope.CreateWAApointment = function(){
        alert('success')
    }
    $scope.Submit = function(){
        ((uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.CreateWAApointment());
    }
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
