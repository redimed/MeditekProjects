var app = angular.module('app.authentication.WAAppointment.controller',[
	'app.authentication.WAAppointment.list.controller',
	'app.authentication.WAAppointment.GP.controller',
	'app.authentication.WAAppointment.directives.listWAAppoint',
	'app.authentication.WAAppointment.services'
]);

app.controller('WAAppointmentCtrl', function($scope){
	$scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();
    });
    $scope.ObjectWa = {};
});