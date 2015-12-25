var app = angular.module("app.authentication.consultation.detail.controller",[
	'app.authentication.consultation.detail.patientAdmission.controller',
	'app.authentication.consultation.detail.consultNote.controller',
	'app.authentication.consultation.detail.eForms.controller',
	'app.authentication.consultation.directives.consultNoteDirectives'
]);

app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices) {
    $scope.userInfo = $cookies.getObject('userInfo');
    $scope.Call = function(){
		window.open('/#/blank/call');
	};
	$scope.eForms = function(){
		$state.go("authentication.eForms.list");
	};
});
