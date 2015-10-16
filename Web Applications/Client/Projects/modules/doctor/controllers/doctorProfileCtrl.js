angular.module('app.authentication.doctor.profile.controller', [])

app.controller('doctorProfileCtrl', function($scope, $modal){
	$scope.changePassword = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl:'modules/doctor/views/doctorModalChangePassword.html',
			controller: 'doctorModalChangePasswordCtrl',
			size: 'sm',
			resolve: {
				getid: function(){
					return true;
				}
			}

		});
	};
});

app.controller('doctorModalChangePasswordCtrl', function($scope, $modalInstance){
	$scope.modal_close = function(){
		$modalInstance.close();
	}
	$scope.close = function(){
		$modalInstance.close();
	}
});