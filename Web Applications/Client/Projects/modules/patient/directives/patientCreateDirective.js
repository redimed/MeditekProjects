var app = angular.module('app.authentication.patient.create.directive',[]);
app.directive('patientCreate',function(toastr, PatientService, $state, $timeout){
	return {
		restrict: "EA",
		link: function(scope, elem, attrs){
			scope.er={};
			scope.isShowNext=false;
			scope.isBlockStep1 =false;
			scope.Back = function() {
				scope.isShowNext=false;
				scope.isShowCreate=false;
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
					scope.isBlockStep1=true;
					PatientService.checkPatient(data)
					.then(function(result){
						if(result!=undefined && result!=null && result!='' && result.length!=0){
							if(result.data.isCheck==false){
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
						toastr.error("Please input correct information","ERROR");
						for(var i = 0; i < err.data.message.ErrorsList.length;i++){
							scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
						}
					});
				},function (err){
					toastr.error("Please check data again.","ERROR");
					scope.er ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
					}
				});
				
			};

			scope.Cancel = function() {
				$state.go('authentication.patient.list',null, {
		            'reload': true
		        });
			};

			scope.createPatient = function(data) {
				// data.DOB = moment(data.DOB).format('YYYY/MM/DD');
				return PatientService.validate(data)
				.then(function(result){
					return PatientService.createPatient(data)
					.then(function(success){
						
					},function(err){
						toastr.error("Please check data again.","ERROR");
						scope.er = scope.er?scope.er:{};
						for(var i = 0; i < err.data.message.ErrorsList.length; i++){
							scope.er[err.data.message.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
						}
					});
				},function(err){
					toastr.error("Please check data again.","ERROR");
					scope.er = scope.er?scope.er:{};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
					}
				});
			}
		},
		templateUrl:"modules/patient/directives/template/patientCreate.html"
	}
});