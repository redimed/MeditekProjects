var app = angular.module("app.authentication.notification.global.detail.controller",[
]);

app.controller('notificationGlobalDetailCtrl', function($scope, $modalInstance){
	$modalInstance.rendered.then(function(){
		App.initAjax();
		ComponentsDateTimePickers.init();
	});
	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	};
	$scope.submit = function(){
		
	};
});