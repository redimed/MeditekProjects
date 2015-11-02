angular.module('app.authentication.doctor.directive.create', [])
.directive('doctorCreate', function(doctorService, UnauthenticatedService, CommonService, $cookies, $filter, toastr, $stateParams, $modal, $state) {

	return {
		//
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/create.html',
		options: {
			scope: '='
		},
		controller: function($scope, FileUploader, $state, toastr) {

			// Signature
			var uploader = $scope.uploader = new FileUploader({
				// url: 'http://192.168.1.2:3005/api/uploadFile',
				url : 'http://testapp.redimed.com.au:3005/api/uploadFile',
				// url: CommonService.ApiUploadFile,
				// url: 'http://localhost:3005/api/uploadFile',
				headers:{Authorization:'Bearer '+$cookies.get("token")},
				alias : 'uploadFile'
			});
			
			// FILTERS
		    uploader.filters.push({
		        name: 'customFilter',
		        fn: function (item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 10;
		        }
		    });

		    // CALLBACKS
		    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
		        // console.info('onWhenAddingFileFailed', item, filter, options);
		    };
		    uploader.onAfterAddingFile = function (fileItem) {
		        // console.info('onAfterAddingFile', fileItem);
		    };

		    uploader.onAfterAddingAll = function (addedFileItems) {
		        // console.info('onAfterAddingAll', addedFileItems);
		    };
		    uploader.onBeforeUploadItem = function (item) {
		        // console.info('onBeforeUploadItem', item);
		    };
		    uploader.onProgressItem = function (fileItem, progress) {
		        // console.info('onProgressItem', fileItem, progress);
		    };
		    uploader.onProgressAll = function (progress) {
		        // console.info('onProgressAll', progress);
		    };
		    uploader.onSuccessItem = function (fileItem, response, status, headers) {
		        // console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploader.onErrorItem = function (fileItem, response, status, headers) {
		        // console.info('onErrorItem', fileItem, response, status, headers);
		    };
		    uploader.onCancelItem = function (fileItem, response, status, headers) {
		        // console.info('onCancelItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteItem = function (fileItem, response, status, headers) {
		        // console.info('onCompleteItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteAll = function () {
		        // console.info('onCompleteAll');
		    };

		    // Profile Image
		    var uploaders = $scope.uploaders = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: 'http://testapp.redimed.com.au:3005/api/uploadFile',
		    	// url: CommonService.ApiUploadFile,
		    	// url: 'http://localhost:3005/api/uploadFile',
		    	headers:{Authorization:'Bearer '+$cookies.get("token")},
		    	alias : 'uploadFile'
		    });
			
			// FILTERS
		    uploaders.filters.push({
		        name: 'customFilter',
		        fn: function (item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 10;
		        }
		    });

		    // CALLBACKS
		    uploaders.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
		        // console.info('onWhenAddingFileFailed', item, filter, options);
		    };
		    uploaders.onAfterAddingFile = function (fileItem) {
		        // console.info('onAfterAddingFile', fileItem);
		    };

		    uploaders.onAfterAddingAll = function (addedFileItems) {
		        // console.info('onAfterAddingAll', addedFileItems);
		    };
		    uploaders.onBeforeUploadItem = function (item) {
		        // console.info('onBeforeUploadItem', item);
		    };
		    uploaders.onProgressItem = function (fileItem, progress) {
		        // console.info('onProgressItem', fileItem, progress);
		    };
		    uploaders.onProgressAll = function (progress) {
		        // console.info('onProgressAll', progress);
		    };
		    uploaders.onSuccessItem = function (fileItem, response, status, headers) {
		        // console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploaders.onErrorItem = function (fileItem, response, status, headers) {
		        // console.info('onErrorItem', fileItem, response, status, headers);
		    };
		    uploaders.onCancelItem = function (fileItem, response, status, headers) {
		        // console.info('onCancelItem', fileItem, response, status, headers);
		    };
		    uploaders.onCompleteItem = function (fileItem, response, status, headers) {
		        // console.info('onCompleteItem', fileItem, response, status, headers);
		    };
		    uploaders.onCompleteAll = function () {
		        // console.info('onCompleteAll');
		    };
		    
		    // Check validate and create doctor and upload profileImage and Signature
		    $scope.create = function(data) {

				doctorService.checkSpecial(data)
				.then(function(success) {

					doctorService.createDoctor(data)
					.then(function(result) {

						for (var i = 0; i < uploader.queue.length; i++) 
			            {
			                var item=uploader.queue[i];
			                item.formData[i]={};
			                item.formData[i].userUID = result.UID;
			                item.formData[i].fileType = 'ProfileImage';
			            }
						uploader.uploadAll();

			            for (var i = 0; i < uploaders.queue.length; i++) 
			            {
			                var item=uploaders.queue[i];
			                item.formData[i]={};
			                item.formData[i].userUID = result.UID;
			                item.formData[i].fileType = 'Signature';
			            }
			            uploaders.uploadAll();

						toastr.success('Create Successfull');
						$state.go('authentication.doctor.list');
					}, function(err) {});

				}, function(err) {
					console.log(err);
				});
				
			};

		},
		link: function(scope, ele, attr) {

			// Variable
			scope.er={};
			scope.isShowNext=true;
			scope.isShowNext2=false;
			scope.isShowNext3=false;
			scope.isShowBack3=false;
			scope.isShowNext4=false;
			scope.isShowBack4=false;
			scope.isShowCreate=false;
			scope.isBlockStep1 =false;
			scope.isBlockStep2 =false;
			scope.isShowNext5=false;

			// Back
			scope.back_1 = function() {
				scope.isBlockStep1 =false;
				scope.isShowNext=true;
				scope.isShowNext3=false;
				scope.isShowBack3=true;
				scope.isShowNext5=false;
				scope.isShowCreate=false;
			};

			scope.back_2 = function() {
				scope.isBlockStep1 =false;
				scope.isShowNext=false;
				scope.isShowNext3=true;
				scope.isShowBack3=true;
				scope.isShowBack4=false;
				scope.isShowNext5=false;
				scope.isShowCreate=false;
			}

			// State
			scope.state = [
				{'code':'Victoria', 'name':'Victoria'},
				{'code':'Tasmania', 'name':'Tasmania'},
				{'code':'Queensland', 'name':'Queensland'},
				{'code':'New_South_Wales', 'name':'New South Wales'},
				{'code':'Western_Australia', 'name':'Western Australia'},
				{'code':'Northern_Territory', 'name':'Northern Territory'},
				{'code':'Austria_Capital_Territory', 'name':'Austria Capital Territory'}
			];
			scope.data.State = scope.state[4].code;

			// Title
			scope.titles = [
				{'id':'1', 'name':'Mr'},
				{'id':'2', 'name':'Mrs'},
				{'id':'3', 'name':'Ms'},
				{'id':'4', 'name':'Dr'}
			];
			scope.data.Titles = scope.titles[0].id;

			// Country List
			doctorService.listCountry()
			.then(function(result) {
				scope.country = result;
				scope.data.CountryID = scope.country[13].ID;
			}, function(err) {});

			// Department List
			doctorService.listDepartment()
			.then(function(result) {
				scope.department = result;
			}, function(err) {});

			// Check validate and Phone and Email
			scope.show = function(data){
				
				doctorService.validateCheckPhone(data)
				.then(function(success) {

					doctorService.checkphoneUserAccount(data)
					.then(function(result) {

						if(result.length > 0) {
							toastr.error('MobilePhone already exists');	
						} else {

							UnauthenticatedService.checkEmailAccount(data)
							.then(function(result) {

								if(result.length > 0) {
									toastr.error('Email already exists');
								} else {
									scope.isShowNext=false;
									scope.isShowNext2=true;
								}

							}, function(err) {});
						}
						
					}, function(err) {});
					
				}, function(err) {});
			
			};
			// Variable temp
			scope.show2 = function(){
				scope.isShowNext2=false;
				scope.isShowNext3=true;
				scope.isShowBack3=true;
			};
			// Check validate
			scope.show3 = function(data){
				doctorService.validateCheckInfo(data)
				.then(function(success) {
					scope.isShowNext3=false;
					scope.isShowNext4=true;
				}, function(err) {});
				
			};
			// Variable temp
			scope.show4 = function(){
				scope.isShowBack3=false;
				scope.isShowNext4=false;
				scope.isShowCreate=true;
				scope.isShowNext5=true;
				scope.isShowBack4=true;
			};
			// Check validate
			scope.show5 = function(data) {
				doctorService.checkSpec(data)
				.then(function(success) {
					scope.isShowNext5=false;
					scope.isShowCreate=true;
				}, function(err) {});
			};		

		} // end link

	} // end return

})