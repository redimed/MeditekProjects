var app = angular.module('app.unAuthentication.activation.controller', [])
app.controller('activationCtrl', function($scope, $state, toastr, $cookies, UnauthenticatedService) {

	$scope.is_hide = false;

	// Back Button
	$scope.back = function() {
		$state.go('unAuthentication.login', null, {
			location: 'replace',
			reload: true
		});
	};

	$scope.check = function(data) {

		$scope.checkCode(data)
		.then(function(success) {

			var info = {
				UserUID: $cookies.getObject('userInfo').UID,
				VerificationCode: data.verifyCode
			};

			UnauthenticatedService.confirmActivate(info)
			.then(function(success) {
				toastr.success('Activated Successfully');
				$state.go('authentication.home.list', null, {
					location: 'replace',
					reload: true
				});
			}, function(err) {

				if(err.data.ErrorsList[0] == "Activation.codeExpired") {
					
					$scope.is_hide = true;
					toastr.error("Activation Code Expired");
				}
				if(err.data.ErrorsList[0] == "Activation.codeInvalid") {
					toastr.error("Activation Code Invalid");
				}
				if(err.data.ErrorsList[0] == "Activation.userUpdateError") {
					toastr.error("Activation Code Failed");
				}

			});

		}, function(err) {
			toastr.error('Activation not empty');
		});
	};

	$scope.clickSend = function() {

		var info = {
			UserUID: $cookies.getObject('userInfo').UID
		};

		UnauthenticatedService.createCoded(info)
		.then(function(result) {

			var info_sms = {
				PhoneNumber: '+840936767117',
				content: result.data.VerificationCode
			};

			UnauthenticatedService.sendSms(info_sms)
			.then(function(success) {
				$scope.is_hide = false;
				$state.go('unAuthentication.activation', null, {
					location: 'replace',
					reload: true
				});
			}, function(err) {})
		
		}, function(err) {});

	};

});