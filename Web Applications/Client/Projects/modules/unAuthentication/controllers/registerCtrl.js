var app = angular.module('app.unAuthentication.register.controller', [
]);

app.controller('registerCtrl', function($scope, $state, FileUploader, toastr, $cookies,UnauthenticatedService){
	
	// List country
	UnauthenticatedService.listCountry()
	.then(function(result) {
		$scope.country = result;
		$scope.data.CountryID = 14;
	}, function(err) {});

	// Check MobilePhone
	$scope.checkUser = function(data) {

		$scope.validateCheck(data)
		.then(function(success) {
			
			UnauthenticatedService.checkUserNameAccount(data)
			.then(function(result) {

				if(result.length > 0) {
					toastr.error('Username already exists');
				} else {

					UnauthenticatedService.checkPhoneUserAccount(data)
					.then(function(result2) {

						if(result2.length > 0) {
							toastr.error('MobilePhone already exists');
						} else {
							
							UnauthenticatedService.checkEmailAccount(data)
							.then(function(result3) {

								if(result3.length > 0) {
									toastr.error('Email already exists');
								} else {

									$scope.step++;
									
								} // end else
							
							}, function(err) {}) // end check email
							
						} // end else

					}, function(err) {}) // end check Mobile

				} // end else

			}) // end check Username
		
		}, function(err) {
			toastr.error('Information not empty');
		});
			
	}
	// Check Info
	$scope.checkInfo = function(data) {

		$scope.validateInfo(data)
		.then(function(success) {
			$scope.step++;
		}, function(err) {
			toastr.error('Information not empty');
		});

	}

	// Signature
	// var uploader = $scope.uploader = new FileUploader({
	// 	// url: 'http://192.168.1.2:3005/api/uploadFile',
 //        url: 'http://localhost:3005/api/uploadFile',
           //url: 'http://testapp.redimed.com.au:3005/api/uploadFile', 
	// 	//headers:{Authorization:'Bearer '+$cookies.get("token")},
 //        alias : 'uploadFile'
	// });
	
	// FILTERS
    // uploader.filters.push({
    //     name: 'customFilter',
    //     fn: function (item /*{File|FileLikeObject}*/, options) {
    //         return this.queue.length < 10;
    //     }
    // });

    // CALLBACKS
    // uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    //     // console.info('onWhenAddingFileFailed', item, filter, options);
    // };
    // uploader.onAfterAddingFile = function (fileItem) {
    //     // console.info('onAfterAddingFile', fileItem);
    // };

    // uploader.onAfterAddingAll = function (addedFileItems) {
    //     // console.info('onAfterAddingAll', addedFileItems);
    // };
    // uploader.onBeforeUploadItem = function (item) {
    //     // console.info('onBeforeUploadItem', item);
    // };
    // uploader.onProgressItem = function (fileItem, progress) {
    //     // console.info('onProgressItem', fileItem, progress);
    // };
    // uploader.onProgressAll = function (progress) {
    //     // console.info('onProgressAll', progress);
    // };
    // uploader.onSuccessItem = function (fileItem, response, status, headers) {
    //     // console.info('onSuccessItem', fileItem, response, status, headers);
    // };
    // uploader.onErrorItem = function (fileItem, response, status, headers) {
    //     // console.info('onErrorItem', fileItem, response, status, headers);
    // };
    // uploader.onCancelItem = function (fileItem, response, status, headers) {
    //     // console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //     // console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // uploader.onCompleteAll = function () {
    //     // console.info('onCompleteAll');
    // };

    // Profile Image
 //    var uploaders = $scope.uploaders = new FileUploader({
 //    	// url: 'http://192.168.1.2:3005/api/uploadFile',
 //        url: 'http://localhost:3005/api/uploadFile',
 //url: 'http://testapp.redimed.com.au:3005/api/uploadFile',
 //        headers:{Authorization:'Bearer '+$cookies.get("token")},
 //    	alias : 'uploadFile'
 //    });
	
	// // FILTERS
 //    uploaders.filters.push({
 //        name: 'customFilter',
 //        fn: function (item /*{File|FileLikeObject}*/, options) {
 //            return this.queue.length < 10;
 //        }
 //    });

    // CALLBACKS
    // uploaders.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
    //     // console.info('onWhenAddingFileFailed', item, filter, options);
    // };
    // uploaders.onAfterAddingFile = function (fileItem) {
    //     // console.info('onAfterAddingFile', fileItem);
    // };

    // uploaders.onAfterAddingAll = function (addedFileItems) {
    //     // console.info('onAfterAddingAll', addedFileItems);
    // };
    // uploaders.onBeforeUploadItem = function (item) {
    //     // console.info('onBeforeUploadItem', item);
    // };
    // uploaders.onProgressItem = function (fileItem, progress) {
    //     // console.info('onProgressItem', fileItem, progress);
    // };
    // uploaders.onProgressAll = function (progress) {
    //     // console.info('onProgressAll', progress);
    // };
    // uploaders.onSuccessItem = function (fileItem, response, status, headers) {
    //     // console.info('onSuccessItem', fileItem, response, status, headers);
    // };
    // uploaders.onErrorItem = function (fileItem, response, status, headers) {
    //     // console.info('onErrorItem', fileItem, response, status, headers);
    // };
    // uploaders.onCancelItem = function (fileItem, response, status, headers) {
    //     // console.info('onCancelItem', fileItem, response, status, headers);
    // };
    // uploaders.onCompleteItem = function (fileItem, response, status, headers) {
    //     // console.info('onCompleteItem', fileItem, response, status, headers);
    // };
    // uploaders.onCompleteAll = function () {
    //     // console.info('onCompleteAll');
    // };

	$scope.save = function(data) {

		data.CreatedDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
        data.Type = 'EXTERTAL_PRACTITIONER';

		UnauthenticatedService.createAccount(data)
		.then(function(result) {

			// for (var i = 0; i < uploader.queue.length; i++) 
   //          {
   //              var item=uploader.queue[i];
   //              item.formData[i]={};
   //              item.formData[i].userUID = result.data.UID;
   //              item.formData[i].fileType = 'ProfileImage';
   //          }
			// uploader.uploadAll();

   //          for (var i = 0; i < uploaders.queue.length; i++) 
   //          {
   //              var item=uploaders.queue[i];
   //              item.formData[i]={};
   //              item.formData[i].userUID = result.data.UID;
   //              item.formData[i].fileType = 'Signature';
   //          }
   //          uploaders.uploadAll();

			var info = {
				PhoneNumber: data.PhoneNumber,
                // PhoneNumber: '+840936767117',
				content: result.data.VerificationCode
			};

			UnauthenticatedService.sendSms(info)
			.then(function(success) {
				toastr.success('Register Successfull');
				$state.go('unAuthentication.login', null, {
					location: 'replace',
					reload: true
				});
			}, function(err) {});
					
		}, function(err) {

            if(err.data.ErrorsList[0] == 'UserName.duplicate') {
                toastr.error('UserName already exists');
            }
            if(err.data.ErrorsList[0] == 'Email.duplicate') {
                toastr.error('Email already exists');
            }
            if(err.data.ErrorsList[0] == 'PhoneNumber.duplicate') {
                toastr.error('PhoneNumber already exists');
            }
			
		});

	}

	// Back Button
	$scope.btn_back = function(){
		// $scope.show_hide =s true;
		$scope.step--;
	}
	
	$scope.step = 1;

});