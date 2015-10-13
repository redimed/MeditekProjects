var app = angular.module('app.authentication.patient.controller', [
	'app.authentication.patient.list.controller',
	'app.authentication.patient.checkPhone.controller',
	'app.authentication.patient.create.controller',
]);

app.controller('patientCtrl', function($scope){
	console.log('patientCtrl');
	$scope.data = {};
});