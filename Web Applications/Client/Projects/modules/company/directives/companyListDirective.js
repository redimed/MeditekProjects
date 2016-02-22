var app = angular.module('app.authentication.company.list.directive',[]);

app.directive('companyList', function($uibModal, $timeout, $state){
	return {
		restrict: 'E',
		templateUrl: 'modules/company/directives/templates/companyListDirective.html',
		link: function(scope, elem, attrs){
			scope.toggle = false;
			scope.companys = [
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
			scope.create = function(){
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl:'modules/company/views/companyCreate.html',
					controller: 'companyCreateCtrl',
					// windowClass : 'app-modal-window',
					size: 'lg',
					resolve: {
						getid: function(){
							return true;
						}
					},
				});
			};
			scope.detail = function(){
				$state.go('authentication.company.detail');
			};
		},
	};
});