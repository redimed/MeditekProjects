/**
 * Directive dùng để upload eform pdf 
 */
angular.module('app.common.uploadEform',[])
.directive('uploadEform',function(CommonService, $rootScope, $cookies, toastr, $uibModal, WAAppointmentService, $timeout){
	return {
		restrict: 'EA',
		scope: {
			ApptUID:"=apptUid",
			PatientUID:"=patientUid",
			userUID:"=userUid",
			onSubmit:"=onSubmit",
		},
		controller: function($scope, FileUploader) {
			$scope.FormName;
			$scope.UID;
			$scope.arr_ApptUID = [];
			function capitalizeFirstLetter(string) {
			    return string.charAt(0).toUpperCase() + string.slice(1);
			}
			function uploadEForm(response, fileItem) {
				var Ext = fileItem.file.type.substr(fileItem.file.type.indexOf('/') + 1, fileItem.file.type.length);
				CommonService.uploadEFormFile({
		        	fileUID:response.fileUID, 
		        	fileName:capitalizeFirstLetter($scope.FormName),
		        	fileExt: Ext,
		        	patientUID:$scope.PatientUID,
		        	arr_ApptUID: $scope.arr_ApptUID,
		        })
		        .then(function(result) {
		        	toastr.success('Upload Successfully.');
		        	if(typeof $scope.onSubmit !== "undefined") $scope.onSubmit();
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
		    	$scope.uploader.queue.splice(0, $scope.uploader.queue.length - 1);
		    	$scope.isChose = true;
		        fileItem.formData[0] = {};
		        fileItem.formData[0].fileType = $scope.fileType;
		       	fileItem.formData[0].userUID = $scope.userUID;
                fileItem.headers.userUID = $scope.userUID;
                fileItem.headers.fileType = $scope.fileType;
                $scope.EFormName = fileItem.file.name.substr(0, fileItem.file.name.lastIndexOf('.'));
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
		            uploadEForm(response, fileItem);
		        }
		        else {
		        	uploadEForm(response, fileItem);
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
			scope.isChose = false;
			scope.checkbox = {};
			$timeout(function() {
				scope.isShowListAppt = true;
				scope.list = [];
				console.log("ApptUID ",scope.ApptUID);
				console.log("PatientUID ",scope.PatientUID);
				if(scope.ApptUID != null && scope.ApptUID != '' && scope.ApptUID != undefined) {
					scope.isShowListAppt = false;
					scope.UID = scope.ApptUID;
					scope.arr_ApptUID.push({UID:scope.UID});
				}
				else {
					WAAppointmentService.loadListWAAppointment({
						Filter:[{
							Patient:{UID : scope.PatientUID}
						}],
						Order:[{
							Appointment:{CreatedDate:"DESC"}
						}]
					})
					.then(function(response) {
						console.log("response ",response);
						for(var i = 0; i < response.rows.length; i++) {
							response.rows[i].CreatedDate = response.rows[i].CreatedDate ? 
							moment(response.rows[i].CreatedDate, 'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY HH:mm:ss') : null;
						}
						scope.list = response.rows;
					}, function(err) {
						console.log("err ",err);
					})
				}
			},2000);

			scope.whenChange = function(item, data) {
				if(scope.checkbox[item] === 'N') {
					if(scope.arr_ApptUID.length > 0) {
						scope.arr_ApptUID = scope.arr_ApptUID.filter(function(i) {
							return i.UID !== data.UID;
						});
					}
				}
				else {
					scope.arr_ApptUID.push({UID:data.UID});
				}
			};

			scope.Add = function(model, data) {
				var modalInstance = $uibModal.open({
					templateUrl: 'ChoseFile',
					scope : scope,
					controller: function($scope, $modalInstance){
						$scope.EFormName;
						$scope.AppointmentUID = scope.arr_ApptUID;
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
							if($scope.AppointmentUID == '' || $scope.AppointmentUID == null || $scope.AppointmentUID.length == 0) {
								toastr.error('Please chose Appointment.');
								o.loadingPage(false);
								return ;
							}
							else {
								scope.FormName = $scope.EFormName;
								// scope.UID = $scope.AppointmentUID;
								$scope.uploader.uploadAll();
								$modalInstance.dismiss('cancel');
							}
							console.log("arr_ApptUID ",scope.arr_ApptUID);
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