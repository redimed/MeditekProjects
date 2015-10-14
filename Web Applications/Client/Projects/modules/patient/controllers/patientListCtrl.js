var app = angular.module('app.authentication.patient.list.controller', [
	'app.authentication.patient.list.modal.controller'
]);

app.controller('patientListCtrl', function($scope, $modal, PatientService){
	$scope.currentPage = 1;
  	$scope.numPerPage = 5;
  	$scope.maxSize = 10;
  	$scope.filteredTodos = [];
	var data ={
		limit:100
	};
	PatientService.loadlistPatient(data).then(function(response){
		if(response.message=="success"){
			$scope.filteredTodos = response.data;
			$scope.$watch("currentPage + numPerPage", function() {
			    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
			    , end = begin + $scope.numPerPage;
			    $scope.patients = $scope.filteredTodos.slice(begin, end);
			  });
		}
		else{
			console.log(response.message);
		}
	});

	$scope.toggle = true;
	$scope.toggleFilter = function(){
		$scope.toggle = $scope.toggle === false ? true : false;
	};

	$scope.openModal = function(patientUID){
		var modalInstance = $modal.open({
			animation : true,
			templateUrl: 'modules/patient/views/patientListModal.html',
			controller:  'patientListModalCtrl',
			windowClass: 'app-modal-window',
			//size: 'lg',
			resolve: {
				data: function(){
					var data = {
							UID:patientUID
						};
					return data;
				}
			}
		});
	};
});