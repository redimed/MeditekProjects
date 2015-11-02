var app = angular.module('app.authentication.WAAppointment.GP.controller',[
]);

app.controller('WAAppointmentGPCtrl', function($scope, $cookies, AppointmentService, $state, FileUploader, $modal, $interval,WAAppointmentService){

    $scope.Skin_cancer_Others = false;
    $scope.info = {};

    $scope.click_other = function(){
        console.log($scope.info.txtSkin_cancer_Others)
        // $scope.Skin_cancer_Others = !$scope.Skin_cancer_Others;
        // $scope.txtSkin_cancer_Others = '';
    }
    WAAppointmentService.loadListAppointment()
    
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