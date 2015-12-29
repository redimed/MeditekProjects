var app = angular.module('app.authentication.WAAppointment.GP.controller', []);
app.controller('showSkinCancerController', function($scope, $modalInstance, toastr, TypeClinical, CommonService, ClinicalDetails) {

    $modalInstance.rendered.then(function() {
        App.initAjax();
    });
    $scope.TypeClinical = TypeClinical;
    if (!$scope.requestInfo) {
        $scope.requestInfo = {};
        if (!$scope.requestInfo.TelehealthAppointment) {
            $scope.requestInfo.TelehealthAppointment = {};
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = {};
            };
        };
    };
    $scope.requestInfo.TelehealthAppointment.ClinicalDetails = angular.copy(ClinicalDetails);
    for (var keyRequestInfo in $scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
        var res = keyRequestInfo.split(".");
        if ($scope.requestInfo.TelehealthAppointment.ClinicalDetails[keyRequestInfo].Value != null 
            && $scope.requestInfo.TelehealthAppointment.ClinicalDetails[keyRequestInfo].Value != '') {
            $scope[res[3]] = true;
            $scope[res[2] + res[3]] = true;
        };
    }
    $scope.ChangeCheckSkinCancer = function(type,name,value) {
        if (!value) {
            var key = 'Clinical__Details.Telehealth__WAAppointment.'+type+'.'+name;
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key]) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key] = {};
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value = '';
            };
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].Value = '';
        };
    };
    $scope.OK = function() {
        $modalInstance.close($scope.requestInfo);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('WAAppointmentGPCtrl', function(WAAppointmentService, $scope, $rootScope, $cookies, AppointmentService, $state, FileUploader, $modal, $interval, AuthenticationService,toastr) {
    $scope.ListContry = [];
    $scope.State = WAConstant.State;
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
    $scope.InterpreterRequiredNo = function() {
        $scope.requestInfo.TelehealthAppointment.PatientAppointment.InterpreterLanguage = null;
    };
    $scope.ClinicalDetails = function(){
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
            if (value.Value != 'N' && value.Value != null ) {
                countCliniDetail++;
            }else{
                if (value.FileUploads.length > 0) {
                    countCliniDetail++;
                };
            };
        });
        if (countCliniDetail == 0) {
            ClinicalDetailsTemp = [];
        };
        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = ClinicalDetailsTemp;
    }
    $scope.sendRequestAppointment = function() {
        if ($scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender === 'Other') {
            $scope.requestInfo.TelehealthAppointment.PatientAppointment.Gender = $scope.showData.GenderOther;
        }
        $scope.ClinicalDetails();
        $scope.requestInfo.RequestDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
        console.log('$scope.requestInfo',$scope.requestInfo);
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
        }, function(err) {
            console.log('Request WAAppointment error');
            if (err.status == 401) {
                swal.close();
            } else {
                swal.close();
                toastr.error("Request Appointment Failed");
            }
        });
    };
   
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
    uploader.filters.push({
        name: 'customImage',
        fn: function(item /*{File|FileLikeObject}*/ , options) {
            var type = item.name.split('.');
             console.log('customImage',type[type.length-1]);
             if(!('|txt|docx|doc|xls|xlsx|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type[type.length-1]) !== -1)){
                return false
             }
             if (item.size > 1024*1024*15) {
                return false
             }else{
                return true
             };
             
        }
    });
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
        //item.headers.Authorization = ('Bearer ' + $cookies.get("token"));
        item.headers={
            Authorization:'Bearer '+$cookies.get("token"),
            systemtype:'WEB',
        },
        console.info('onBeforeUploadItem', item.headers);
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
        if(Boolean(headers.requireupdatetoken)===true)
        {
            $rootScope.getNewToken();
        }
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

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
        if(Boolean(headers.requireupdatetoken)===true)
        {
            $rootScope.getNewToken();
        }
        if (response.status == 'success') {
            var key = 'Clinical__Details.Telehealth__WAAppointment.Notes.' + fileItem.formData[0].fileTypeClinical;
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key]) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key] = {};
            };
            if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads) {
                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads = [];
            };
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[key].FileUploads.push({
                UID: response.fileUID
            })
            console.log($scope.requestInfo.TelehealthAppointment.ClinicalDetails);
        }else{
            toastr.error("Upload Image error");
            swal.close();
            
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
    $scope.ShowDialog = function(TypeClinical) {
        if ($scope.requestInfo.TelehealthAppointment.ClinicalDetails == undefined 
            || $scope.requestInfo.TelehealthAppointment.ClinicalDetails == null) {
            $scope.requestInfo.TelehealthAppointment.ClinicalDetails = {};
        };
        var TypeClinical = TypeClinical;
        var modalInstance = $modal.open({
            templateUrl: 'showSkinCancer',
            controller: 'showSkinCancerController',
            windowClass: 'app-modal-window-full',
            resolve: {
                TypeClinical: function() {
                    return TypeClinical;
                },
                ClinicalDetails: function() {
                    return $scope.requestInfo.TelehealthAppointment.ClinicalDetails;
                }
            }
        });
        modalInstance.result.then(function(response) {
            if (response != null && response != undefined) {
                for (var keyResponse in response.TelehealthAppointment.ClinicalDetails) {
                    var checkExits = false;
                    if (!$scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = {};
                        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = response.TelehealthAppointment.ClinicalDetails;
                    } else {
                        for (var keyRequestInfo in $scope.requestInfo.TelehealthAppointment.ClinicalDetails) {
                            if (keyRequestInfo == keyResponse) {
                                $scope.requestInfo.TelehealthAppointment.ClinicalDetails[keyResponse] = response.TelehealthAppointment.ClinicalDetails[keyResponse];
                                checkExits = true;
                            };
                        }
                        if (!checkExits) {
                            $scope.requestInfo.TelehealthAppointment.ClinicalDetails[keyResponse] = response.TelehealthAppointment.ClinicalDetails[keyResponse];
                        };
                    };
                }
            };
        });
    };
    $scope.Speciality = function(){
        $scope.requestInfo.TelehealthAppointment.PreferredPractitioner[0].Name = '';
    }
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
