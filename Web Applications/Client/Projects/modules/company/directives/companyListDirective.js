var app = angular.module('app.authentication.company.list.directive',[]);

app.directive('companyList', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			iscompanycreate:'=isCompanyCreate',
			patientuid:'=onPatientUid',
			companyinfo:'=onCompanyInfo',
			cancel:'=onCancel'
		},
		templateUrl: 'modules/company/directives/templates/companyListDirective.html',
		link: function(scope, elem, attrs){
			scope.patientuid = scope.patientuid?scope.patientuid:null;
			console.log(scope.patientuid);
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
						$scope.info = scope.companyinfo;
						$scope.cancel = function(){
							$modalInstance.dismiss('cancel');
						};
						$scope.load = function() {
							scope.loadlist(scope.searchObjectMap);
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

			scope.linkpatient = function(company) {
				var companyuid = company.UID;
				var siteId;
				var modalInstance = $uibModal.open({
                    templateUrl: 'LinkStaffModal',
                    controller: function($scope,$modalInstance){
                       	$scope.companyuid  = companyuid;

                        $scope.search = {};
						$scope.toggle = true;
						$scope.count;
						$scope.companys = [];
						$scope.fieldSort={};
						$scope.fieldSort['SiteName']='ASC';
						$scope.fieldSort['Enable']='ASC';

						$scope.setPage = function() {
				            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
				            $scope.loadlist($scope.searchObjectMap);
				        };

						$scope.Search = function(data,e){

							if(e==13){
								$scope.searchObjectMap.Search = data;
								$scope.loadlist($scope.searchObjectMap);
							}
						};

						$scope.sort = function(field,sort) {
							$scope.isClickASC = false;

							if(sort==="ASC"){
								$scope.isClickASC = true;
								$scope.fieldSort[field]= 'DESC';
							}
							else{
								$scope.isClickASC = false;
								$scope.fieldSort[field]= 'ASC';
							}
							var data = field+" "+sort;
							$scope.searchObjectMap.order = data;
							$scope.loadlist($scope.searchObjectMap);
						};

						$scope.loadlist = function(data) {
							companyService.getDetailChild(data)
							.then(function(response) {
								$scope.count = response.count;
								$scope.sites = response.data;
								for(var i = 0; i < $scope.sites.length;i++){
									$scope.sites[i].stt = $scope.searchObjectMap.offset*1 + i + 1;
								}
							},function(err) {
								console.log(err);
							});
						};

						$scope.init = function() {
							console.log("$scope.companyuid ",$scope.companyuid);
							$scope.searchObject = {
				                limit: 5,
				                offset: 0,
				                currentPage: 1,
				                maxSize: 1,
				                // attrs:scope.items,
				                Search:null,
				                order: null,
				                UID:$scope.companyuid,
								model:'CompanySites',
				            };
				            $scope.searchObjectMap = angular.copy($scope.searchObject);
				            $scope.loadlist($scope.searchObjectMap);
						};

						$scope.viewDetail = function(site) {
							// viewDetailModal
							var modalInstance = $uibModal.open({
								templateUrl: 'viewDetailModal',
								controller: function($scope,$modalInstance){
									$scope.site = site;
									console.log($scope.site);
									$scope.cancel = function(){
										$modalInstance.dismiss('cancel');
									};
									$scope.loadDetail = function() {
										companyService.loadDetail({model:'CompanySite',UID:$scope.site.UID})
										.then(function(response) {
											console.log(response);
											$scope.data = response.data;
										},function(err) {
											console.log(err);
										});
									};

									$scope.loadDetail();
								},
								// windowClass: 'app-modal-window'
								size: 'lg',

							});
						};

						$scope.selectSite = function(site) {
							siteId = site;
							$modalInstance.dismiss('cancel');

						};

						$scope.init();

                    },
                        // size: 'lg',
                    windowClass: 'app-modal-window'
                }).result.finally(function(){
                    if(siteId) {
                        swal({   
							title: "Are you sure?", 
							text: "Are you want to link this patient to the current company?" ,
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
								companyService.createStaff({CompanyUID:company.UID,patientUID:scope.patientuid})
								.then(function(success) {
									console.log(success);
									// toastr.success("success","success");
									scope.cancel({company:company,site:siteId});
								},function(err) {
									console.log(err);
									if(err.data.ErrorsList[0] == 'Patient.Company.HasAssociation') {
										// toastr.error("Patient has linked with Company","error");
										scope.cancel({company:company,site:siteId});
									}
									else {
										toastr.error("error","error");	
									}
								});
							}
						});
                    }
                });
			};

			scope.init();

		},
	};
});