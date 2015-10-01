var app = angular.module('app.loggedIn.doctor.profile.controller',[
]);

app.controller('doctorProfileCtrl', function($scope, $modal){
	$scope.changePassword = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl:'modules/doctor/views/doctorModalChangePassword.html',
			//controller: 'appointmentModalCtrl',
			//windowClass : 'app-modal-window',//add class
			size: 'sm',
			resolve: {
				getid: function(){
					return true;
				}
			}

		});
	};

});