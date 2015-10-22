var app = angular.module('app.authentication.patient.list.controller', [
]);

app.controller('patientListCtrl', function($scope, $modal, PatientService){
	$scope.item =[
		{field:"FirstName",name:"First Name"},
		{field:"LastName",name:"Last Name"},
		{field:"UserAccount",name:"Mobile"}
	];
	$scope.isCreate=false;
	$scope.isSelect=true;
	$scope.aa = function(){
		console.log($scope.uid);
	}
});