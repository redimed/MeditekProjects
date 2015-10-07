var app = angular.module('app.authentication.patient.list.controller', [
	'app.authentication.patient.list.modal.controller'
]);

app.controller('patientListCtrl', function($scope, $modal){
	$scope.patients = [
		{
			ID: 1,
			FirstName: 'Robert', 
			LastName: 'GaiGia',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 2,
			FirstName: 'Terry', 
			LastName: 'Bodgard',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 3,
			FirstName: 'Joe', 
			LastName: 'Higatoshi',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 4,
			FirstName: 'Rock', 
			LastName: 'Haword',
			Address: '01 Australia',
			PostCode: '123'
		},
		{
			ID: 6,
			FirstName: 'Alfred', 
			LastName: 'AAA',
			Address: '01 China',
			PostCode: '456'
		},
		{
			ID: 7,
			FirstName: 'Robert', 
			LastName: 'GaiGia',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 8,
			FirstName: 'Terry', 
			LastName: 'Bodgard',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 9,
			FirstName: 'Joe', 
			LastName: 'Higatoshi',
			Address: '01 Ash Crimson Iran',
			PostCode: '7894'
		},
		{
			ID: 10,
			FirstName: 'Rock', 
			LastName: 'Haword',
			Address: '01 Australia',
			PostCode: '123'
		},
		{
			ID: 11,
			FirstName: 'Alfred', 
			LastName: 'AAA',
			Address: '01 China',
			PostCode: '456'
		}
	];

	$scope.toggle = true;
	$scope.toggleFilter = function(){
		$scope.toggle = $scope.toggle === false ? true : false;
	}

	$scope.openModal = function(){
		var modalInstance = $modal.open({
			animation : true,
			templateUrl: 'modules/patient/views/patientListModal.html',
			controller:  'patientListModalCtrl',
			windowClass: 'app-modal-window',
			//size: 'lg',
			resolve: {
				getid: function(){
					return true;
				}
			}
		});
	};
});