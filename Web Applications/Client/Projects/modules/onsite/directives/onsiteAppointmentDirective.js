var app = angular.module('app.authentication.onsite.appointment.directive',[]);

app.directive('onsiteAppointment', function($uibModal, $timeout, $state){
	return {
		restrict: 'E',
		templateUrl: 'modules/onsite/directives/templates/onsiteAppointmentDirective.html',
		link: function(scope, elem, attrs){
		},
	};
});