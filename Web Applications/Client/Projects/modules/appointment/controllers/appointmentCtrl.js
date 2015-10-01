var app = angular.module('app.loggedIn.appointment.controller', [
	'app.loggedIn.appointment.list.controller',
	'app.loggedIn.appointment.request.controller'
]);

app.controller('appointmentCtrl', function($scope, $modal, $state){
	// $scope.sendRequest = function(){
	// 	// var modalInstance = $modal.open({
	// 	// 	animation: true,
	// 	// 	templateUrl:'modules/appointment/views/appointmentAddView.html',
	// 	// 	controller: 'appointmentAddCtrl'
	// 	// 	size: 'lg',
	// 	// 	resolve: {
	// 	// 		getid: function(){
	// 	// 			return true;
	// 	// 		}
	// 	// 	}

	// 	// });
	// };
	// $scope.sendRequest = function(){
	// 	$state.go('loggedIn.request');
	// 	// , null, 
	// 	// {
	// 	// 	reload:true
	// 	// });
	// };
	// $scope.openAppointmentModal = function(){
	// 	var modalInstance = $modal.open({
	// 		animation: true,
	// 		templateUrl:'modules/appointment/views/appointmentModal.html',
	// 		controller: 'appointmentModalCtrl',
	// 		windowClass : 'app-modal-window',
	// 		resolve: {
	// 			getid: function(){
	// 				return true;
	// 			}
	// 		}

	// 	});
	// };

});

// app.controller('appointmentModalCtrl', function($scope, $modal, $modalInstance){

// });