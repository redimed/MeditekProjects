var app = angular.module('app.authentication.appointment.request.controller', [
    'app.authentication.appointment.request.modal.controller'
]);

app.controller('appointmentRequestCtrl', function($scope, $cookies, AppointmentService, $state, FileUploader, $modal) {

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
                Address: null,
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
        }
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
    $scope.sendRequestAppointment = function() {
        $scope.requestInfo.RequestDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss Z");
        $scope.requestInfo.TelehealthAppointment.RefDate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss Z");
        $scope.requestInfo.TelehealthAppointment.PatientAppointment.DOB = moment($scope.patientAppointmentDOBTemp).format("YYYY-MM-DD hh:mm:ss Z");

        $scope.requestInfo.TelehealthAppointment.PreferedPlasticSurgeon = [];
        $scope.requestInfo.TelehealthAppointment.ClinicalDetails = [];
    	$scope.requestInfo.FileUploads = [{
            UID:"057e517f-abf6-4f67-a25a-cbf7304ff648"
        },{
            UID:"089abbf3-bc8a-4ef1-b1c1-32d2df2f33d2"
        }];

    	_.forEach($scope.doctors, function(item) {
		  	if (item != undefined || item != null) {
                var data = {
                    Name : item
                }
		  		$scope.requestInfo.TelehealthAppointment.PreferedPlasticSurgeon.push(data);
		  	};
		});

        _.forEach($scope.details, function(item) {
            _.forEach(item.data,function(p){
                if(p.value){
                    var data = {
                        Section: "Clinical Details",
                        Category: "Telehealth Appointment",
                        Type: item.type,
                        Name: p.name,
                        Value: p.value,
                        ClinicalNote: ($scope.ClinicalNote)?$scope.ClinicalNote:null,
                        Description: null
                    }
                    $scope.requestInfo.TelehealthAppointment.ClinicalDetails.push(data);
                }
            })
        });

        AppointmentService.SendRequest($scope.requestInfo).then(function(data){
            swal({   
                title: "Success",   
                text: "Send Request Successfully!",   
                type: "success",
                showLoaderOnConfirm: true, 
            }, function(){   
                $state.go("authentication.appointment.list");
            });
        },function (error) {
            swal({   
                title: "Error",   
                text: "Send Request Error!",   
                type: "error"
            });
        });
    }

    var uploader = $scope.uploader = new FileUploader({
            url: 'theme/assets/global/plugins/angularjs/plugins/angular-file-upload/upload.php'
        });

    // FILTERS

    uploader.filters.push({
        name: 'imageFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
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
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);

    $scope.ModalBodyPart = function(){
        var modalInstance = $modal.open({
            animation: true,
            templateUrl:'modules/appointment/views/appointmentRequestModal.html',
            controller: 'appointmentRequestModalCtrl',
            //windowClass : 'app-modal-window',
            size: 'lg',
            resolve: {
                getid: function(){
                    return true;
                }
            }
        });
    };

});
