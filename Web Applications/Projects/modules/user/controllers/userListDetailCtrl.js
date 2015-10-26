var app = angular.module('app.authentication.user.list.detail.controller',[
]);

app.controller('userListDetailCtrl', function($scope, $modalInstance){
	console.log('userListDetailCtrl');
	$scope.close = function() {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.modal_close = function() {
		$modalInstance.dismiss('cancel');
	};
});