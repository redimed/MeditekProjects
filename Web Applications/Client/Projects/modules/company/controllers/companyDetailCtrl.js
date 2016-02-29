var app = angular.module('app.authentication.company.detail.controller',[
	'app.authentication.company.detail.site.controller',
	'app.authentication.company.detail.insurer.controller',
	'app.authentication.company.detail.staff.controller',
	'app.authentication.company.detail.userAccount.controller',
]);

app.controller('companyDetailCtrl', function($scope, $uibModal,$stateParams){
	console.log($stateParams);
	$scope.uid = $stateParams.companyUID;
	
});