var app = angular.module('app.authentication.company.detail.controller',[
	'app.authentication.company.detail.insurer.controller',
	'app.authentication.company.detail.staff.controller',
]);

app.controller('companyDetailCtrl', function($scope, $uibModal){
	$scope.companys = {
		insurers: [],
		staffs: [],
	};
	// insurer list
	$scope.insurer = function(action, index){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modules/company/views/insurer.html',
			controller: 'insurerCtrl',
			size: action === 'delete' ? 'md' : 'lg',
			resolve: {
				modal_action: function(){
					return action;
				}, 
				modal_data: function(){
					return $scope.companys.insurers;
				}, 
				modal_index: function(){
					return index;
				},
			},
		});
		modalInstance.result
	        .then(function(result) {
	        	if(action === 'update'){
	            	$scope.companys.insurers[result.index] = result.data;
	            }else if(action === 'delete'){
	            	$scope.companys.insurers.splice(result.index, 1);
	            }
			}, function(result) {
				// dismiss
			});
	};
	// staff list
	$scope.staff = function(action, index){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modules/company/views/staff.html',
			controller: 'staffCtrl',
			size: action === 'delete' ? 'md' : 'lg',
			resolve: {
				modal_action: function(){
					return action;
				}, 
				modal_data: function(){
					return $scope.companys.staffs;
				}, 
				modal_index: function(){
					return index;
				},
			},
		});
		modalInstance.result
	        .then(function(result) {
	        	if(action === 'update'){
	            	$scope.companys.staffs[result.index] = result.data;
	            }else if(action === 'delete'){
	            	$scope.companys.staffs.splice(result.index, 1);
	            }
			}, function(result) {
				// dismiss
			});
	};
});