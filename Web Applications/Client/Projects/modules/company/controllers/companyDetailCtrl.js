var app = angular.module('app.authentication.company.detail.controller',[
	'app.authentication.company.detail.site.controller',
	'app.authentication.company.detail.insurer.controller',
	'app.authentication.company.detail.staff.controller',
	'app.authentication.company.detail.userAccount.controller',
]);

app.controller('companyDetailCtrl', function($scope, $uibModal){
	$scope.companys = {
		company_name: 'Meditek',
		description: 'lorem ipsum ...',
		sites: [
			{
				site_name: 'Chi Nhánh Việt Nam', 
				address1: '17 Hồ Văn Huê, phường 9, quận Phú Nhuận',
				address2: '43 Mạc Đỉnh Chi, Phường 1, quận 1',
				suburb: 'Tp.HCM',
				postcode: '1234',
				state: 'Washington DC',
				country: 'USA',
				contact_name: 'Mr. Siro',
				contact_number: '0123 456 7899',
			},
		],
		insurers: [],
		staffs: [],
		userAccounts: [],
	};
	// site list
	$scope.site = function(action, index){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modules/company/views/site.html',
			controller: 'siteCtrl',
			size: action === 'delete' ? 'md' : 'lg',
			resolve: {
				modal_action: function(){
					return action;
				}, 
				modal_data: function(){
					return $scope.companys.sites;
				}, 
				modal_index: function(){
					return index;
				},
			},
		});
		modalInstance.result
	        .then(function(result) {
	        	if(action === 'update'){
	            	$scope.companys.sites[result.index] = result.data;
	            }else if(action === 'delete'){
	            	$scope.companys.sites.splice(result.index, 1);
	            }
			}, function(result) {
				// dismiss
			});
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
	// userAccount list
	$scope.userAccount = function(action, index){
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'modules/company/views/userAccount.html',
			controller: 'userAccountCtrl',
			size: action === 'delete' ? 'md' : 'lg',
			resolve: {
				modal_action: function(){
					return action;
				}, 
				modal_data: function(){
					return $scope.companys.userAccounts;
				}, 
				modal_index: function(){
					return index;
				},
			},
		});
		modalInstance.result
	        .then(function(result) {
	        	if(action === 'update'){
	            	$scope.companys.userAccounts[result.index] = result.data;
	            }else if(action === 'delete'){
	            	$scope.companys.userAccounts.splice(result.index, 1);
	            }
			}, function(result) {
				// dismiss
			});
	};
});