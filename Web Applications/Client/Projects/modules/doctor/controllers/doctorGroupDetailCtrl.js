var app = angular.module('app.authentication.doctor.groupDetail.controller', [
]);
app.controller('doctorGroupDetailCtrl', function($scope, $uibModal){
	$scope.openModalAdd = function(){
		var modalInstance = $uibModal.open({
			templateUrl: 'modules/doctor/views/doctorModalAddGroup.html',
			controller: function($scope,$modalInstance){
				$scope.cancel = function(){
					$modalInstance.dismiss('cancel');
				};
				$scope.submit = function(){
					alert('submit');
				};
			},
			// windowClass: 'app-modal-window'
			size: 'lg',
		});
	};
});
