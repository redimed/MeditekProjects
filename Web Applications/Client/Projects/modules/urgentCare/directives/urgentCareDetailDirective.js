var app = angular.module('app.authentication.urgentCare.detail.directive',[
]);

app.directive('urgentcareDetail', function($modal){
	return {
		restrict: 'E',
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareDetail.html',
		link: function(scope){
			scope.close = function(){alert('directives');};
		},
	};
});