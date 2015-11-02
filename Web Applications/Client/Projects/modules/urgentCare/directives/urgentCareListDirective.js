var app = angular.module('app.authentication.urgentCare.directive.list',[]);

app.directive('urgentcareList', function($modal){
	return {
		restrict: 'E',
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareList.html',
		link: function(scope){
			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			scope.openModal = function(){
				$modal.open({
					templateUrl: 'modules/urgentCare/views/urgentCareListDetail.html',
					controller: 'urgentCareListDetailCtrl',
					windowClass: 'app-modal-window',
				});
			}
		},
	};
});