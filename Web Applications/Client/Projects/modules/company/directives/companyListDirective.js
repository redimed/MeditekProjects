var app = angular.module('app.authentication.company.list.directive',[]);

app.directive('companyList', function($uibModal, $timeout, $state, companyService){
	return {
		restrict: 'E',
		templateUrl: 'modules/company/directives/templates/companyListDirective.html',
		link: function(scope, elem, attrs){
			scope.search = {};
			scope.toggle = true;
			scope.count;
			scope.companys = [];
			scope.fieldSort={};
			scope.fieldSort['CompanyName']='ASC';
			scope.fieldSort['Active']='ASC';
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};

			scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadlist(scope.searchObjectMap);
	        };

			scope.Search = function(data,e){

				if(e==13){
					scope.searchObjectMap.Search = data;
					scope.loadlist(scope.searchObjectMap);
				}
			};

			scope.sort = function(field,sort) {
				scope.isClickASC = false;

				if(sort==="ASC"){
					scope.isClickASC = true;
					scope.fieldSort[field]= 'DESC';
				}
				else{
					scope.isClickASC = false;
					scope.fieldSort[field]= 'ASC';
				}
				var data = field+" "+sort;
				scope.searchObjectMap.order = data;
				scope.loadlist(scope.searchObjectMap);
			};

			scope.loadlist = function(data) {
				companyService.getlist(data)
				.then(function(response) {
					console.log(response.data);
					scope.count = response.data.count;
					scope.companys = response.data.rows;
				},function(err) {
					console.log(err);
				});
			};

			scope.create = function(){
				var modalInstance = $uibModal.open({
					templateUrl: 'companyCreatemodal',
					controller: function($scope,$modalInstance){
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
					},
					// windowClass: 'app-modal-window'
					size: 'lg',

				});
			};
			scope.detail = function(uid){
				// $state.go('authentication.company.detail');
				$state.go('authentication.company.detail', {companyUID:uid});
			};

			scope.init = function() {
				scope.searchObject = {
	                limit: 5,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 1,
	                // attrs:scope.items,
	                Search:null,
	                order: null
	            };
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadlist(scope.searchObjectMap);
			};

			scope.init();

		},
	};
});