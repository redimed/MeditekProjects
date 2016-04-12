var app = angular.module('app.authentication.company.staff.directive',[]);

app.directive('companyStaff', function($uibModal, $timeout, $state, companyService, toastr){
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
		templateUrl: 'modules/company/directives/templates/companyStaffDirective.html',
		link: function(scope, elem, attrs){
			scope.data = {};
			console.log(scope);
			scope.staff = {};
			scope.staff.runIfSuccess = function(data){
				console.log(data);
				companyService.createStaff({CompanyUID:scope.compuid,patientUID:data.UID})
				.then(function(success) {
					console.log(success);
					toastr.success("success","success");
					scope.cancel();
					scope.loadagain();
				},function(err) {
					console.log(err);
					if(err.data.ErrorsList[0] == 'Patient.Company.HasAssociation') {
						toastr.error("Patient has linked with Company","error");
					}
					else {
						toastr.error("error","error");	
					}
				});
			};

			scope.staff.runIfClose =  function() {
			    scope.cancel();                    
			};
			scope.click = function() {
				if(scope.type == 'delete') {
					console.log(scope.uid);
					scope.postData = {};
					scope.postData.Active = 'N';
					scope.whereClauses = {
						PatientID : scope.uid.ID,
						CompanyID : scope.compid
						// Active    : 'Y'
					};
					companyService.changestatus({whereClauses:scope.whereClauses, info:scope.postData, model:'RelCompanyPatient'})
					.then(function(response) {
						console.log(response);
						toastr.success("Delete Successfully","success");
						scope.cancel();
						scope.loadagain();
					},function(err) {
						console.log(err);
						toastr.error("Delete Error","error");
					});
				}
			};

		},
	};
});