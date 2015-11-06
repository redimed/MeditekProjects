var app = angular.module('app.unAuthentication.register.controller', [
]);

app.controller('registerCtrl', function($scope, $state, FileUploader, toastr, $cookies, CommonService, doctorService, UnauthenticatedService){
	
	// List country
	UnauthenticatedService.listCountry()
	.then(function(result) {
		$scope.country = result;
		$scope.data.CountryID = 14;
	}, function(err) {});

    // Back
    $scope.stepback_one = function() {
    	$state.go('unAuthentication.login', {
    		reload: true
    	});
    }

	// Check MobilePhone
	$scope.checkUser = function(data) {
		$scope.loadingpage = true;
		$scope.validateCheck(data)
		.then(function(success) {

			UnauthenticatedService.checkUserNameAccount(data)
			.then(function(result) {

				if(result.length > 0) {
					$scope.loadingpage = false;
					toastr.error('Username already exists');
				} else {

					UnauthenticatedService.checkPhoneUserAccount(data)
					.then(function(result2) {

						if(result2.length > 0) {
							$scope.loadingpage = false;
							toastr.error('MobilePhone already exists');
						} else {
							
							UnauthenticatedService.checkEmailAccount(data)
							.then(function(result3) {

								if(result3.length > 0) {
									$scope.loadingpage = false;
									toastr.error('Email already exists');
								} else {

									$scope.step++;
									$scope.loadingpage = false;
									
								} // end else
							
							}, function(err) {
								$scope.loadingpage = false;
							}) // end check email
							
						} // end else

					}, function(err) {
						$scope.loadingpage = false;
					}) // end check Mobile

				} // end else

			}) // end check Username
		
		}, function(err) {
			$scope.loadingpage = false;
		});
			
	}

    // Check Info
    $scope.save = function(data) {

        $scope.validateInfo(data)
        .then(function(success) {
            
            data.CreatedDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
            data.Type = 'EXTERTAL_PRACTITIONER';

            UnauthenticatedService.createAccount(data)
            .then(function(result) {
                var info = {
                    PhoneNumber: data.PhoneNumber,
                    // PhoneNumber: '+840936767117',
                    content: CommonService.contentVerify+ ' ' +result.data.VerificationCode
                };
                UnauthenticatedService.sendSms(info)
                .then(function(success) {
                    toastr.success('Register Successfull');
                    $state.go('unAuthentication.login', null, {
                        location: 'replace',
                        reload: true
                    });
                }, function(err) {});
                        
            }, function(err) {});
        }, function(err) {});

    }

	// Back Button
	$scope.btn_back = function(){
		// $scope.show_hide =s true;
		$scope.step--;
	}
	
	$scope.step = 1;

});