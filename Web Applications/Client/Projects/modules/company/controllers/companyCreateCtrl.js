var app = angular.module('app.authentication.company.create.controller',[
]);

app.controller('companyCreateCtrl', function($scope, $modalInstance){
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.save = function(){
		alert('Save');
	};
});