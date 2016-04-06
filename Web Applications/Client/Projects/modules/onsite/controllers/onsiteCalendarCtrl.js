var app = angular.module('app.authentication.onsite.calendar.controller', []);

app.controller('onsiteCalendarCtrl', function($scope, $modalInstance ,getItem) {
	//console.log(getItem);
	$scope.item = getItem;
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
