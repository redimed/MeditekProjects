var app = angular.module('app.authentication.doctor.list.controller',[]);

app.controller('doctorListCtrl', function($scope, $modal){
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

	$scope.toggle = true;
	$scope.toggleFilter = function(){
		$scope.toggle = $scope.toggle === false ? true : false;
	}
});

app.controller('doctorModalCtrl', function ($scope, $modalInstance){
	$scope.modal_close = function(){
		$modalInstance.close();
	}
	$scope.close = function(){
		$modalInstance.close();
	}
});