var app = angular.module('app.authentication.urgentCare.list.directive',[]);

app.directive('urgentcareList', function($modal){
	return {
		restrict: 'E',
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareList.html',
		link: function(scope){
			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			scope.typeFullName = 'DESC';
			scope.sortDataTable = function(field, type){
				scope.typeFullName = type == 'ASC'  ? 'DESC' : 'ASC';
				scope.typeFullName = type == 'DESC' ? 'ASC'  : 'DESC';
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