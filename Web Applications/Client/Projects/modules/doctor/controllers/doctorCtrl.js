var app = angular.module('app.loggedIn.doctor.controller', []);

app.controller('doctorCtrl', function($scope, $modal, $state){
	$scope.openModalDoctor = function(){
		var modalInstance = $modal.open({
			animation : true,
			templateUrl: 'modules/doctor/views/doctorModal.html',
			controller:  'doctorModalCtrl',
			windowClass: 'app-modal-window',
			resolve: {
				getid: function(){
					return true;
				}
			}
		});
	};

	// $scope.createDoctor = function(){
	// 	$state.go('loggedIn.doctor.create', null, {reload: true;});
	// };

});

app.controller('doctorModalCtrl', function (){
	//
});