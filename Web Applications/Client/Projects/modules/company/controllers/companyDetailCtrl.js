var app = angular.module('app.authentication.company.detail.controller',[
]);

app.controller('companyDetailCtrl', function($scope, $uibModal,$stateParams){
	console.log($stateParams);
	$scope.uid = $stateParams.companyUID;
	
});