var app = angular.module('app.authentication.patient.create.directive',[]);
app.directive('patientCreate',function(toastr, PatientService, $state, $timeout){
	return {
		restrict: "EA",
		link: function(scope, elem, attrs){
			scope.er={};
			scope.ermsg={};
			scope.isShowNext=false;
			scope.isBlockStep1 =false;
			scope.Back = function() {
				scope.isShowNext=false;
				scope.isShowCreate=false;
				scope.isBlockStep1=false;
			};
			//event timeout will call after this template's directive rendered
			$timeout(function(){
				Metronic.setAssetsPath('theme/assets/'); // Set the assets folder path	
				FormWizard.init(); // form step
			},0); 
			scope.checkPhone = function(data) {
				PatientService.validateCheckPhone(data)
				.then(function(success){
					scope.er ='';
					scope.ermsg='';
					scope.isBlockStep1=true;
					PatientService.checkPatient(data)
					.then(function(result){
						if(result!=undefined && result!=null && result!='' && result.length!=0){
							if(result.data.isCreated==false){
								scope.er ='';
								scope.ermsg='';
								toastr.success("Phone number can user to create patient","SUCCESS");
								scope.isShowEmail = result.data.data.Email;
								scope.data.Email = result.data.data.Email;
								scope.isShowNext = true;
							}
							else{
								toastr.error("Phone Number da duoc tao patient","ERROR");
								scope.isBlockStep1 =false;
							}
						}
					}, function(err){
						scope.er={};
						scope.ermsg={};
						toastr.error("Please input correct information","ERROR");
						for(var i = 0; i < err.data.message.ErrorsList.length;i++){
							scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
						}
					});
				},function (err){
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
				
			};

			scope.Cancel = function() {
				$state.go('authentication.patient.list',null, {
		            'reload': true
		        });
			};

			scope.createPatient = function(data) {
				return PatientService.validate(data)
				.then(function(result){
					return PatientService.createPatient(data)
					.then(function(success){
						toastr.success("Create Successful!!","SUCCESS");
						$state.go('authentication.patient.list',null, {
		           			'reload': true
		        		});
					},function(err){
						scope.er={};
						scope.ermsg={};
						toastr.error("Please check data again.","ERROR");
						scope.er = scope.er?scope.er:{};
						for(var i = 0; i < err.data.message.ErrorsList.length; i++){
							scope.er[err.data.message.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
						}
					});
				},function(err){
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					scope.er = scope.er?scope.er:{};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
			}
		},
		templateUrl:"modules/patient/directives/template/patientCreate.html"
	}
});