var app = angular.module('app.authentication.onsite.calendar.controller', []);

app.controller('onsiteCalendarCtrl', function($scope, $modalInstance ) {
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.Cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.Save = function(){
	};
});
