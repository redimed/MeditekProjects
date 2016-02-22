var app = angular.module('app.authentication.onsiteAppointment.list.directive',[]);

app.directive('onsiteAppointmentList', function($uibModal, $timeout, $state){
	return {
		restrict: 'E',
		templateUrl: 'modules/onsiteAppointment/directives/templates/onsiteAppointmentListDirective.html',
		link: function(scope, elem, attrs){
			scope.toggle = false;
			scope.onsiteAppointments = [
				{name: 'Meditek', active: 'Y'},
				{name: 'Redimed', active: 'N'},
				{name: 'Australia', active: 'N'},
			];
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			$timeout(function(){
				// ComponentsDateTimePickers.init(); // init todo page
			});
			// scope.create = function(){
			// 	var modalInstance = $uibModal.open({
			// 		animation: true,
			// 		templateUrl:'modules/onsiteAppointment/views/onsiteAppointmentCreate.html',
			// 		controller: 'onsiteAppointmentCreateCtrl',
			// 		// windowClass : 'app-modal-window',
			// 		size: 'lg',
			// 		resolve: {
			// 			getid: function(){
			// 				return true;
			// 			}
			// 		},
			// 	});
			// };
			// scope.detail = function(){
			// 	$state.go('authentication.onsiteAppointment.detail');
			// };
		},
	};
});