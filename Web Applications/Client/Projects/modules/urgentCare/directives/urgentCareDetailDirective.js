var app = angular.module('app.authentication.urgentCare.detail.directive',[
]);

app.directive('urgentcareDetail', function($timeout){
	return {
		restrict: 'E',
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareDetail.html',
		link: function(scope){
			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init(); // init todo page
			});
		},
	};
});