var app = angular.module('app.authentication.company.detail.directive',[]);

app.directive('companyDetail', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid'
		},
		templateUrl: 'modules/company/directives/templates/companyDetailDirective.html',
		link: function(scope, elem, attrs){
			scope.count;
			scope.styles = {};
			scope.info = {};
			scope.updatedata = {};
			scope.search = {};
			//load company detail
			scope.getDetailCompany = function(){
				companyService.detailcompany({UID:scope.uid})
				.then(function(response) {
					if(response.data){
						scope.info = response.data;
						companyService.getDetailChild({UID:response.data.UID,model:'CompanySites'})
						.then(function(result){
							scope.info.CompanySites = result.data;
						},function(err) {
							console.log(err);
						})
					}
				}, function(err) {
					console.log(err);
				});
			};

			scope.getDetailCompany();

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
							companyService.createUser({CompanyUID:uid,patientUID:data.UID})
							.then(function(success) {
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
						$scope.compid   = scope.info.ID;
						$scope.staff = {};
						$scope.staff.runIfSuccess = function(data){
							toastr.success("success","success");
							$scope.cancel();
							scope.viewmodel('Patients');
						};
						$scope.staff.runIfClose = function(){
							$modalInstance.dismiss('cancel');
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

			scope.init = function() {
	            scope.searchObjectMap = {
	                limit: isNaN(scope.limit)?10:scope.limit,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                // attributes:scope.items,
	                Search:null,
	                order: null,
	                model:null
	            };
	        };

	        scope.init();

			scope.setPage = function(model) {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.viewmodel(model);
	        };

			scope.viewmodel = function(model) {
				function callData (value) {
					if(model == 'Patients'){
						var data = {
							UID:scope.info.UID,
							model:model,
							Search:!value.Search?null:value.Search,
							limit:!value.limit?null:value.limit,
							offset:!value.offset?null:value.offset,
						};
					}
					else {
						var data = {
							UID:scope.info.UID,
							model:model
						};
					}
					companyService.getDetailChild(data)
					.then(function(result){
						scope.info[model] = result.data;
						for(var i = 0; i < scope.info[model].length;i++){
							scope.info[model][i].stt = scope.searchObjectMap.offset*1 + i + 1;
						}
						scope.count = result.count?result.count:null;
					},function(err) {
						console.log(err);
					});
				}
				if(!model) {
					console.log("invalid.model");
				}
				else {
					if(!scope.searchObjectMap.model){
						scope.searchObjectMap.model = model;
						callData(scope.searchObjectMap);
					}
					else if(scope.searchObjectMap.model != model) {
						scope.init();
						scope.searchObjectMap.model = model;
						callData(scope.searchObjectMap);
					}
					else if(scope.searchObjectMap.model == model) {
						callData(scope.searchObjectMap);
					}
				}
			};

			scope.deleteUser = function(data) {
				swal({   
					title: "Delete User", 
					text: "Do you want delete this user?" ,
					type: "warning",   
					showCancelButton: true,   
					confirmButtonColor: "#DD6B55",   
					confirmButtonText: "Ok",   
					cancelButtonText: "Cancel",   
					closeOnConfirm: true,   
					closeOnCancel: true 
				}, 
				function(isConfirm){   
					if (isConfirm) {  
						companyService.changestatus({
												whereClauses:{
													RoleId:6,UserAccountId:data.UserAccountID
												},
												info:{Enable:'N'}, 
												model:'RelUserRole',
												CompanyID:data.RelCompanyPatient.CompanyID,
												isRemoveAdmin:true,
												PatientID:data.ID
						})
						.then(function(response) {
							scope.viewmodel('UserAccounts');
							toastr.success("Delete Successfully","success");
						},function(err) {
							console.log(err);
							toastr.error("Delete Error","error");
						});
					}
				});
			};

			scope.Search = function(data,e){
				if(e==13){
					scope.searchObjectMap.Search = data;
					scope.viewmodel('Patients');
				}
			};

			scope.checknull = function(name) {
				if(scope.search[name] == '' || scope.search[name] == null) {
					delete scope.search[name];
				}
			};

			scope.updateCompany = function(info) {
				var modalInstance = $uibModal.open({
					templateUrl: 'UpdateCompanyModal',
					controller: function($scope,$modalInstance){
						$scope.info   = angular.copy(info);
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.reset = function() {
							toastr.success("Update Successfully");
							scope.getDetailCompany();
							$modalInstance.dismiss('cancel');
						};
						$scope.click = function() {
							if( angular.equals($scope.info,info) == true ) {
								toastr.error('Please change basic information before update');
							}
							else {
								var data = {
									CompanyName: $scope.info.CompanyName,
									Description: $scope.info.Description,
									UID: $scope.info.UID
								};
								console.log(data);
								companyService.update({model:'Company',info:data})
								.then(function(result) {
									console.log(result);
									$scope.reset();
								},function(err) {
									console.log(err);
								});
							}
						};
					},
					// size: 'lg',
					windowClass: 'app-modal-window'
				});
			};
		},
	};
});