var app = angular.module('app.authentication.patient.create.directive',[]);
app.directive('patientCreate',function(toastr, PatientService, $state){
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

			scope.checkPhone = function(data) {
				return scope.validateCheckPhone(data)
				.then(function(success){
					scope.er ='';
					scope.isBlockStep1=true;
					PatientService.checkPatient(data)
					.then(function(result){
						if(result!=undefined && result!=null && result!='' && result.length!=0){
							console.log(result.data);
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
						else{
							console.log(result.data);
						}
					}, function(err){
						toastr.error("Please input correct information","ERROR");
						console.log(err.data.message.ErrorsList);
						for(var i = 0; i < err.data.message.ErrorsList.length;i++){
							scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
						}
					});
				},function (err){
					console.log(err);
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
				// console.log(data);
				// var DOB =moment(data.DOB).format();
				// console.log(DOB);
				data.DOB = moment(data.DOB).format('YYYY/MM/DD');
				return scope.validate(data)
				.then(function(result){
					return PatientService.createPatient(data)
					.then(function(success){
						console.log(success);
					},function(err){
						console.log(err);
					});
				},function(err){
					toastr.error("Please check data again.","ERROR");
					scope.er ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
					}
				});
			}
		},
		templateUrl:"modules/patient/directives/template/patientCreate.html"
	}
});