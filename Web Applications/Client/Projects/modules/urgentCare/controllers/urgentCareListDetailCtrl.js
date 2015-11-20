var app = angular.module("app.authentication.urgentCare.list.detail.controller", [	
]);

app.controller('urgentCareListDetailCtrl', function($scope, $modalInstance){
	$scope.close = function() { 
		$modalInstance.close(); 
	};
});