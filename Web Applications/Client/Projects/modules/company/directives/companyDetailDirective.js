var app = angular.module('app.authentication.company.detail.directive',[]);

app.directive('companyDetail', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid'
		},
		templateUrl: 'modules/company/directives/templates/companyDetailDirective.html',
		link: function(scope, elem, attrs){
			scope.info = {};
			scope.updatedata = {};
			//load company detail
			scope.init = function(){
				companyService.detailcompany({UID:scope.uid})
				.then(function(response) {
					console.log(response);
					if(response.data.Patients) {
						for(var i = 0; i < response.data.Patients.length; i++) {
							if(response.data.Patients[i].Active == 'N') 
								response.data.Patients.splice(i, 1);
						}
					}
					scope.info = response.data;
				}, function(err) {
					console.log(err);
				});
			};

			scope.init();

			scope.openmodal = function(model, type, uid) {
				console.log(uid);
				var Url = 
				model=='CompanySite'?'CompanySitemodal':model=='UserAccount'?'Usermodal':model=='Staff'?'Staffmodal':'Insuresmodal';
				// console.log(type," ",uid);
				var modalInstance = $uibModal.open({
					templateUrl: Url,
					controller: function($scope,$modalInstance){
						$scope.type = type;
						$scope.uid  = uid?uid:null;
						$scope.Compuid  = scope.info.UID;
						$scope.Compid   = scope.info.ID;
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.loadagain = function() {
							scope.init();
						};
					},
					size: 'lg',
					windowClass: model=='Staff'?'app-modal-window':null
				});
			}

			scope.companys = {
				insurers: [],
				staffs: [],
			};
			// insurer list
			scope.insurer = function(action, index){
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
							return scope.companys.insurers;
						}, 
						modal_index: function(){
							return index;
						},
					},
				});
				modalInstance.result
			        .then(function(result) {
			        	if(action === 'update'){
			            	scope.companys.insurers[result.index] = result.data;
			            }else if(action === 'delete'){
			            	scope.companys.insurers.splice(result.index, 1);
			            }
					}, function(result) {
						// dismiss
					});
			};
			// staff list
			scope.staff = function(action, index){
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
							return scope.companys.staffs;
						}, 
						modal_index: function(){
							return index;
						},
					},
				});
				modalInstance.result
			        .then(function(result) {
			        	if(action === 'update'){
			            	scope.companys.staffs[result.index] = result.data;
			            }else if(action === 'delete'){
			            	scope.companys.staffs.splice(result.index, 1);
			            }
					}, function(result) {
						// dismiss
					});
			};
		},
	};
});