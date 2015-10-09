var app = angular.module('app.authentication.appointment.list.controller', [
	'app.authentication.appointment.list.modal.controller'
]);

app.controller('appointmentListCtrl', function($scope, $modal, $state){
	$scope.appointments = [
		{
			ID: 1,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr. Hanh Nguyen',
			Submit_Date : '01/01/2015 01:01:01',
			Status: '<span class="label label-success">Booked </span>',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 2,
			FirstName: 'Kyo ',
			LastName: 'Kusanagi',
			Treating_Practictioner: 'Dr. Hanh Nguyen',
			Submit_Date : '02/04/2015 02:03:04',
			Status: '<span class="label label-default">Calling </span>',
			Appointment_Date : '04/05/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 3,
			FirstName: 'Iori',
			LastName: 'Yagami',
			Treating_Practictioner: 'Dr Adrian Brooks',
			Submit_Date : '07/05/2015 03:06:07',
			Status: 'Pending',
			Appointment_Date : '',
			Correspondence : 'Checked'
		},
		{
			ID: 4,
			FirstName: 'Chizuru',
			LastName: 'Kagura',
			Treating_Practictioner: 'Dr. Daniel Luo',
			Submit_Date : '05/05/2015 71:07:08',
			Status: 'Finish',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 5,
			FirstName: 'Mai',
			LastName: 'Shimura',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 6,
			FirstName: 'King',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 7,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 8,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 9,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 10,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 11,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 12,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 13,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 14,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 15,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 16,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 17,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 18,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 19,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		},
		{
			ID: 20,
			FirstName: 'Hanna',
			LastName: 'Montana',
			Treating_Practictioner: 'Dr Hanh',
			Submit_Date : '01/01/2015 01:01:01',
			Status: 'Booked',
			Appointment_Date : '01/01/2015 01:01:01',
			Correspondence : 'Checked'
		}
	];


	$scope.openAppointmentModal = function(){
		var modalInstance = $modal.open({
			animation: true,
			templateUrl:'modules/appointment/views/appointmentListModal.html',
			controller: 'appointmentListModalCtrl',
			windowClass : 'app-modal-window',
			//size: 'lg',
			resolve: {
				getid: function(){
					return true;
				},
			}
		});
	};

	$scope.toggle = true;
	$scope.toggleFilter = function(){
		$scope.toggle = $scope.toggle === false ? true : false;
	}
});