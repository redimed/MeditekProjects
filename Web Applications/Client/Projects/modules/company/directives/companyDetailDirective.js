var app = angular.module('app.authentication.company.detail.directive',[]);

app.directive('companyDetail', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid'
		},
		templateUrl: 'modules/company/directives/templates/companyDetailDirective.html',
		link: function(scope, elem, attrs){
			scope.styles = {};
			scope.info = {};
			scope.updatedata = {};
			//load company detail
			scope.init = function(){
				companyService.detailcompany({UID:scope.uid})
				.then(function(response) {
					if(response.data){
						scope.info = response.data;
						companyService.getDetailChild({UID:response.data.UID,model:'CompanySites'})
						.then(function(result){
							console.log(result);
							scope.info.CompanySites = result.data;
						},function(err) {
							console.log(err);
						})
					}
				}, function(err) {
					console.log(err);
				});
			};

			scope.init();

			scope.openmodal = function(model, type, uid) {
				// console.log(uid);
				var Url = model=='CompanySite'?'CompanySitemodal':model=='UserAccounts'?'Usermodal':model=='Staff'?'Staffmodal':'Insuresmodal';
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
							var compareModel = model=='CompanySite'?'CompanySites':model=='UserAccounts'?'UserAccounts':model=='Staff'?'Patients':'Funds';
							scope.viewmodel(compareModel);
						};
						$scope.reset = function() {
							toastr.success("Create Successfully","success");
							// scope.init();
							scope.viewmodel(model);
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'lg',
					windowClass: model=='Staff'||model=='UserAccounts'?'app-modal-window':null
				});
			};

			scope.openLinkPatient = function() {
				var uid = scope.info.UID;
				var modalInstance = $uibModal.open({
					templateUrl: 'linkPatient',
					controller: function($scope,$modalInstance){
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.compid = scope.info.ID;
						$scope.staff = {};
						$scope.staff.runIfSuccess = function(data){
							console.log(data);
							console.log(uid);
							companyService.createUser({CompanyUID:uid,patientUID:data.UID})
							.then(function(success) {
								console.log(success);
								toastr.success("success","success");
								$scope.cancel();
								scope.viewmodel('UserAccounts');
								// scope.loadagain();
							},function(err) {
								console.log(err);
								if(err.data.ErrorsList[0] == 'UserAccount.Company.HasAssociation') {
									toastr.error("UserAccount has linked with Company","error");
								}
								else {
									toastr.error("error","error");	
								}
							});
						};
						$scope.staff.createSuccess = function(data) {
							console.log(data);
							toastr.success("success","success");
							$scope.cancel();
							scope.viewmodel('UserAccounts');
						};
						$scope.loadagain = function() {
							scope.viewmodel('UserAccounts');
						};
						$scope.reset = function() {
							toastr.success("Create Successfully","success");
							// scope.init();
							scope.viewmodel('UserAccounts');
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'lg',
					windowClass: 'app-modal-window'
				});
			};

			scope.openCreateStaff = function() {
				var uid = scope.info.UID;
				var modalInstance = $uibModal.open({
					templateUrl: 'CreateStaff',
					controller: function($scope,$modalInstance){
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.compid   = scope.info.ID;
						$scope.staff = {};
						$scope.staff.runIfSuccess = function(data){
							toastr.success("success","success");
							$scope.cancel();
							scope.viewmodel('Patients');
						};
						$scope.loadagain = function() {
							scope.viewmodel('Patients');
						};
						$scope.reset = function() {
							toastr.success("Create Successfully","success");
							// scope.init();
							scope.viewmodel('Patients');
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'lg',
					windowClass: 'app-modal-window'
				});
			};

			scope.viewmodel = function(model) {
				if(!model) {
					console.log("invalid.model");
				}
				else {
					companyService.getDetailChild({UID:scope.info.UID,model:model})
					.then(function(result){
						console.log(result);
						scope.info[model] = result.data;
					},function(err) {
						console.log(err);
					});
				}
			};
		},
	};
});