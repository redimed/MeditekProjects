var app = angular.module('app.authentication.patient.list.directive',[]);
app.directive('patientList', function(PatientService, $modal, toastr){
	return {
		restrict: "EA",
		link: function(scope, elem, attrs){
			scope.loadList = function(info){
				PatientService.loadlistPatient(info).then(function(response){
					if(response.message=="success"){
						scope.patients = response.data;
						for(var i = 0; i < response.data.length;i++){
							scope.patients[i].stt = scope.searchObjectMap.offset*1 + i + 1;
						}
						scope.count= response.count;
					}
					else{
						console.log(response.message);
					}
				});
			};
			scope.init = function() {
	            scope.searchObject = {
	                limit: 5,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                values:null,
	                order: null
	            };
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

	        scope.init();
			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};

			scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.clickOpen = function(patientUID){
				//scope.ID = patientUID;
				var modalInstance = $modal.open({
					templateUrl: 'patientListmodal',
					controller: function($scope){
						$scope.ID = patientUID;
						$scope.close = function() {
							modalInstance.close();
						};
						$scope.savechange = function(data){
							PatientService.updatePatient(data).then(function(response){
								toastr.success("update success!!!","SUCCESS");
								modalInstance.close('cancel');
							},function(err){
								toastr.error(err.data.message.errors,"ERROR");
								$scope.info = angular.copy(oriInfo);
							});
						}
					},
					windowClass: 'app-modal-window'
					//size: 'lg',
				});
			};

			scope.Search = function(data){
				scope.searchObjectMap.values = data;
				PatientService.searchPatient(scope.searchObjectMap).then(function(response){
					scope.patients = response.data;
					for(var i = 0; i < response.data.length;i++){
						scope.patients[i].stt = scope.searchObjectMap.offset*1 + i + 1;
					}
					scope.count= response.count;
				},function(err){
					toastr.error("Server Error","ERROR");
				});

			};

			scope.sortASC = function(data) {
				scope.searchObjectMap.order = data;
				scope.loadList(scope.searchObjectMap);
			};

			scope.sortDESC = function(data) {
				scope.searchObjectMap.order = data;
				scope.loadList(scope.searchObjectMap);
			}
		},
		templateUrl:"modules/patient/directives/template/patientList.html"
	};
});