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
					console.log(response);
					scope.info = response.data;
					for(var i = 0; i < scope.info.CompanySites.length; i++) {
						if(scope.info.CompanySites[i].Enable == 'Y') {
							scope.styles = {width:1}
						}
						else
							scope.styles = {};
					}

				}, function(err) {
					console.log(err);
				});
			};

			scope.init();

			scope.openmodal = function(model, type, uid) {
				// console.log(uid);
				var Url = model=='CompanySite'?'CompanySitemodal':model=='UserAccount'?'Usermodal':model=='Staff'?'Staffmodal':'Insuresmodal';
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
						$scope.reset = function() {
							toastr.success("Create Successfully","success");
							scope.init();
							$modalInstance.dismiss('cancel');
						}
					},
					size: 'lg',
					windowClass: model=='Staff'||model=='UserAccount'?'app-modal-window':null
				});
			}
		},
	};
});