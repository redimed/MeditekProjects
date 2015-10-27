angular.module('app.authentication.doctor.directive.detail', [])
.directive('doctorDetail', function(doctorService, CommonService, $filter, toastr, $modal) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/detail.html',
		scope: {
			doctorId:'=',
			accountId: '=',
			departmentId: '=',
			success: '=',
			onCancel: '='
		},
		controller: function($scope, toastr, $state) {

			// // Signature
			// var uploader = $scope.uploader = new FileUploader({
			// 	// url: 'http://192.168.1.2:3005/api/uploadFile',
		 //        url: 'http://localhost:3005/api/uploadFile',
			// 	alias : 'uploadFile'
			// });
			
			// // FILTERS
		 //    uploader.filters.push({
		 //        name: 'customFilter',
		 //        fn: function (item /*{File|FileLikeObject}*/, options) {
		 //            return this.queue.length < 10;
		 //        }
		 //    });

		 //    // CALLBACKS
		 //    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
		 //        // console.info('onWhenAddingFileFailed', item, filter, options);
		 //    };
		 //    uploader.onAfterAddingFile = function (fileItem) {
		 //        // console.info('onAfterAddingFile', fileItem);
		 //    };

		 //    uploader.onAfterAddingAll = function (addedFileItems) {
		 //        // console.info('onAfterAddingAll', addedFileItems);
		 //    };
		 //    uploader.onBeforeUploadItem = function (item) {
		 //        // console.info('onBeforeUploadItem', item);
		 //    };
		 //    uploader.onProgressItem = function (fileItem, progress) {
		 //        // console.info('onProgressItem', fileItem, progress);
		 //    };
		 //    uploader.onProgressAll = function (progress) {
		 //        // console.info('onProgressAll', progress);
		 //    };
		 //    uploader.onSuccessItem = function (fileItem, response, status, headers) {
		 //        // console.info('onSuccessItem', fileItem, response, status, headers);
		 //    };
		 //    uploader.onErrorItem = function (fileItem, response, status, headers) {
		 //        // console.info('onErrorItem', fileItem, response, status, headers);
		 //    };
		 //    uploader.onCancelItem = function (fileItem, response, status, headers) {
		 //        // console.info('onCancelItem', fileItem, response, status, headers);
		 //    };
		 //    uploader.onCompleteItem = function (fileItem, response, status, headers) {
		 //        // console.info('onCompleteItem', fileItem, response, status, headers);
		 //    };
		 //    uploader.onCompleteAll = function () {
		 //        // console.info('onCompleteAll');
		 //    };

		 //    // Profile Image
		 //    var uploaders = $scope.uploaders = new FileUploader({
		 //    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		 //        url: 'http://localhost:3005/api/uploadFile',
		 //    	alias : 'uploadFile'
		 //    });
			
			// // FILTERS
		 //    uploaders.filters.push({
		 //        name: 'customFilter',
		 //        fn: function (item /*{File|FileLikeObject}*/, options) {
		 //            return this.queue.length < 10;
		 //        }
		 //    });

		 //    // CALLBACKS
		 //    uploaders.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
		 //        // console.info('onWhenAddingFileFailed', item, filter, options);
		 //    };
		 //    uploaders.onAfterAddingFile = function (fileItem) {
		 //        // console.info('onAfterAddingFile', fileItem);
		 //    };

		 //    uploaders.onAfterAddingAll = function (addedFileItems) {
		 //        // console.info('onAfterAddingAll', addedFileItems);
		 //    };
		 //    uploaders.onBeforeUploadItem = function (item) {
		 //        // console.info('onBeforeUploadItem', item);
		 //    };
		 //    uploaders.onProgressItem = function (fileItem, progress) {
		 //        // console.info('onProgressItem', fileItem, progress);
		 //    };
		 //    uploaders.onProgressAll = function (progress) {
		 //        // console.info('onProgressAll', progress);
		 //    };
		 //    uploaders.onSuccessItem = function (fileItem, response, status, headers) {
		 //        // console.info('onSuccessItem', fileItem, response, status, headers);
		 //    };
		 //    uploaders.onErrorItem = function (fileItem, response, status, headers) {
		 //        // console.info('onErrorItem', fileItem, response, status, headers);
		 //    };
		 //    uploaders.onCancelItem = function (fileItem, response, status, headers) {
		 //        // console.info('onCancelItem', fileItem, response, status, headers);
		 //    };
		 //    uploaders.onCompleteItem = function (fileItem, response, status, headers) {
		 //        // console.info('onCompleteItem', fileItem, response, status, headers);
		 //    };
		 //    uploaders.onCompleteAll = function () {
		 //        // console.info('onCompleteAll');
		 //    };

		    // Save data
			$scope.save = function(data) {

				var info = {
					UID: data.UID,
					Title: data.Title,
					FirstName: data.FirstName,
					MiddleName: data.MiddleName,
					LastName: data.LastName,
					DOB: data.DOB,
					Address1: data.Address1,
					Address2: data.Address2,
					Postcode: data.Postcode,
					Suburb: data.Suburb,
					State: data.State,
					CountryID: data.CountryID,
					HomePhoneNumber: data.HomePhoneNumber,
					WorkPhoneNumber: data.WorkPhoneNumber,
					HealthLink: data.HealthLinkID,
					ProviderNumber: data.ProviderNumber,
					Enable: data.Enable,
					UserAccountID: data.UserAccountID
				};

				doctorService.validinfo(info)
				.then(function(success) {

					console.log(info);
					doctorService.updateDoctor(info)
					.then(function(response) {
						$scope.success = true;
						console.log(response[0].UID);
						console.log(response);
						// for (var i = 0; i < uploader.queue.length; i++) 
			   //          {
			   //              var item=uploader.queue[i];
			   //              item.formData[i]={};
			   //              item.formData[i].userUID = result.UID;
			   //              item.formData[i].fileType = 'ProfileImage';
			   //          }
						// uploader.uploadAll();

			   //          for (var i = 0; i < uploaders.queue.length; i++) 
			   //          {
			   //              var item=uploaders.queue[i];
			   //              item.formData[i]={};
			   //              item.formData[i].userUID = result.UID;
			   //              item.formData[i].fileType = 'Signature';
			   //          }
			   //          uploaders.uploadAll();

					}, function(err) {
						toastr.error('Updated Failed');
					});

				}, function(err) {
					toastr.error('Information not empty');
				});

			}


		},
		link: function(scope, ele, attrs) {

			// Variable
			var info_list = {
				UID: scope.doctorId,
				UserAccountID: scope.accountId,
				DepartmentID: scope.departmentId
			};

			doctorService.getByidDoctor(info_list)
			.then(function(result) {
				scope.info = angular.copy(result[0]);
				if(result[0].HealthLink !== 'undefined') {
					scope.info.HealthLinkID = result[0].HealthLink;
				}
				if(result[0].Title !== 'undefined') {
					scope.info.Title = parseInt(result[0].Title);
				}
				if(result[0].Department.DepartmentName !== 'undefined') {
					scope.info.Department = result[0].Department.DepartmentName;
				}
			}, function(err) {});

			doctorService.getFile(info_list)
			.then(function(result_f) {

				for(var i=0; i< result_f.length; i++) {
					if(result_f[i].FileType === "Signature") {
						scope.signature = 'http://localhost:3005/api/downloadFile/' + result_f[i].UID;
					}
					if(result_f[i].FileType === "ProfileImage") {
						scope.profileImage = 'http://localhost:3005/api/downloadFile/' + result_f[i].UID;
					}
				}

			}, function(err) {});

			// Title
			scope.titles = [
				{id:"0", name:"Mr"},
				{id:"1", name:"Mrs"},
				{id:"2", name:"Ms"},
				{id:"3", name:"Dr"}
			];

			// Country List
			doctorService.listCountry()
			.then(function(result) {
				scope.country = result;
			}, function(err) {});


		} // end link

	} // end return

});