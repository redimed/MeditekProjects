var app = angular.module('app.authentication.eForm.list.directive',[]);

app.directive('eformList', function(){
	return {
		restrict: 'E',
		templateUrl: 'modules/eForm/directives/templates/eFormListDirective.html',
	};
});