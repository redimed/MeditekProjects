var app = angular.module('app.authentication.eForms.detail.controller',[
]);

app.controller('eFormsDetailCtrl', function($scope){
	console.log('eFormsDetailCtrl');
	$scope.exem;
	$scope.aaa = function(id) {
		alert(id);
	}
});