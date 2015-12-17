var app = angular.module("app.authentication.consultation.detail.controller",[
	'app.authentication.consultation.detail.patientAdmission.controller',
	'app.authentication.consultation.detail.consultNote.controller',
	'app.authentication.consultation.detail.eForms.controller',
]);

app.controller('consultationDetailCtrl', function($scope){
	$scope.Call = function(){
		window.open('/#/consultation/call');
	};
});