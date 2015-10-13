var app = angular.module('app.authentication.patient.create.controller', [
]);

app.controller('patientCreateCtrl', function($scope, $modal, $state){
	console.log('patientCreateCtrl');
	console.log($scope.data);
	//$state.go('app.authentication.patient.confirm');
});