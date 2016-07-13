/**
 * Directive dùng để upload eform pdf 
 */
angular.module('app.common.uploadEform',[])
.directive('uploadEform',function(CommonService, $rootScope, $cookies, toastr, $uibModal){
	return {
		restrict: 'EA',
		scope: {
			ApptUID:"=apptUid",
			PatientUID:"=patientUid",
			userUID:"=userUid"
		},
		controller: function($scope, FileUploader) {
			$scope.FormName;
			function capitalizeFirstLetter(string) {
			    return string.charAt(0).toUpperCase() + string.slice(1);
			}
			function uploadEForm(response) {
				CommonService.uploadEFormFile({
		        	fileUID:response.fileUID, 
		        	fileName:capitalizeFirstLetter($scope.FormName),
		        	patientUID:$scope.PatientUID,
		        	ApptUID: $scope.ApptUID ? $scope.ApptUID : null,
		        })
		        .then(function(result) {
		        	toastr.success('Upload Successfully.');
		        	o.loadingPage(false);
		        }, function(err) {
		        	toastr.error('Upload error.');
		        })
			}
			//create reqeust uploader
			$scope.fileType = 'MedicalImage';
		    var uploader = $scope.uploader = new FileUploader({
		        // url: 'http://192.168.1.2:3005/api/uploadFile',
		        url: o.const.uploadFileUrl,
		        autoUpload: false,
		        withCredentials: true,
		        alias: 'uploadFile'
		    });
		    uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type) !== -1;
                }
            });
		    uploader.onAfterAddingFile = function(fileItem) {
		    	$scope.isChose = true;
		        fileItem.formData[0] = {};
		        fileItem.formData[0].fileType = $scope.fileType;
		       	fileItem.formData[0].userUID = $scope.userUID;
                fileItem.headers.userUID = $scope.userUID;
                fileItem.headers.fileType = $scope.fileType;
		    };
		    uploader.onBeforeUploadItem = function(item) {
		        item.headers.Authorization = 'Bearer ' + $cookies.get("token");
		        item.headers.systemtype = 'WEB';
		        console.info('onBeforeUploadItem', item);
		    };
		    uploader.onCompleteItem = function(fileItem, response, status, headers) {
		        console.info('onCompleteItem', response);
		        if (Boolean(headers.requireupdatetoken) === true) {
		            $rootScope.getNewToken();
		            uploadEForm(response);
		        }
		        else {
		        	uploadEForm(response);
		        }
		        
		    };
		    uploader.onErrorItem = function(fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		        if (Boolean(headers.requireupdatetoken) === true) {
		            $rootScope.getNewToken();
		        }
		    };
		},
		link:function(scope,element,attrs) {
			console.log("????????")
			scope.isChose = false;
			scope.Add = function(model, data) {
				var modalInstance = $uibModal.open({
					templateUrl: 'ChoseFile',
					scope : scope,
					controller: function($scope, $modalInstance){
						$scope.EFormName;
						$scope.errorObj = {};
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.setNull = function() {
							$scope.errorObj = {};
							if($scope.EFormName == null || $scope.EFormName == '') {
								$scope.EFormName = null;
							}
						}
						$scope.Submit = function() {
							o.loadingPage(true);
							if($scope.EFormName == '' || $scope.EFormName == null) {
								toastr.error('Please input EForm Name.');
								$scope.errorObj = { 'border': '2px solid #DCA7B0' };
								o.loadingPage(false);
								return ;
							}
							if($scope.uploader.queue.length == 0) {
								toastr.error('Please chose file.');
								o.loadingPage(false);
								return ;
							}
							else {
								scope.FormName = $scope.EFormName;
								$scope.uploader.uploadAll();
								$modalInstance.dismiss('cancel');
							}
						};
					},
					size: 'lg',
					// windowClass: model=='Staff'?'app-modal-window':null
				});
			};

		},
		templateUrl: "common/directives/uploadEform.html"
	}
});