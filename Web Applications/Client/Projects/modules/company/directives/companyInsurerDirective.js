var app = angular.module('app.authentication.company.insurer.directive',[]);

app.directive('companyInsurer', function($uibModal, $timeout, $state, companyService, toastr){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid',
			compuid:'=onComp',
			compid:'=onCompid',
			type:'=onType',
			loadagain:'=onLoadAgain',
			cancel:'=onCancel'
		},
		templateUrl: 'modules/company/directives/templates/companyInsurerDirective.html',
		link: function(scope, elem, attrs){
			scope.whereClauses = {};
			scope.data;
			scope.count;
			scope.isLoading = false;
			scope.uidReturn = null;
			scope.init = function() {
	            scope.searchObject = {
	                limit: 10,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5
	            };
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

	        scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadList(scope.searchObjectMap);
	        };

	        scope.loadList = function(info){
				companyService.getlistFund(info).then(function(response){
					scope.data = response.data;
					scope.count= response.count;
				});
			};
			if(scope.type == 'create') {
				scope.init();
			}

			scope.selectFund = function(uid) {
				if(scope.uidReturn == uid){
					scope.uidReturn = null;
					$('#'+uid).removeClass('choose');
				}
				else{
					if(scope.uidReturn != null) {
						$('#'+scope.uidReturn).removeClass('choose');
					}
					scope.uidReturn = uid;
					$('#'+uid).addClass('choose');
				}
			};
			


			scope.whereClauses.FundID = scope.uid.ID;
			scope.whereClauses.CompanyID = scope.compid;
			scope.click = function() {
				scope.isLoading = true;
				if(scope.type == 'create') {
					if(scope.uidReturn == null || scope.uidReturn == ''){
						scope.isLoading = false;
						toastr.error('Please choose fund to add','error');
					}
					else {
						scope.isLoading = false;
						console.log(scope.uidReturn);
						console.log(scope.compuid);
						companyService.createFund({FundUID:scope.uidReturn,CompanyUID:scope.compuid})
						.then(function(response) {
							console.log(response);
							toastr.success('Add successfully','success');
							scope.cancel();
							scope.loadagain();
						},function(err) {
							console.log(err);
							if(err.data.ErrorsList[0] === 'Company.HasAssociation.Fund') {
								toastr.error("Company already has this fund","error");
							}
							else {
								console.log(err);
								toastr.error('Add failed','error');
							}
							// scope.cancel();
							// scope.loadagain();
						});
						
					}
				}
				else if(scope.type == 'delete') {
					scope.postData = {};
					scope.postData.Active = scope.uid.RelFundCompany.Active == 'Y'?'N':'Y';
					console.log("where ?????");
					console.log(scope.whereClauses);
					companyService.changestatus({
						whereClauses:scope.whereClauses, 
						info:scope.postData, 
						model:'RelFundCompany'
					})
					.then(function(response) {
						console.log(response);
						toastr.success("Change Status Successfully","success");
						scope.cancel();
						scope.loadagain();
					},function(err) {
						console.log(err);
						toastr.error("Change Status Error","error");
					});
				}
			}
		},
	};
});