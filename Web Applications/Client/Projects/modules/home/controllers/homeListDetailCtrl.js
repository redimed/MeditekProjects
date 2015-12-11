var app = angular.module('app.authentication.home.detail.controller',[
	'app.authentication.home.modal.controller',
]);

app.controller('homeDetailCtrl', function(HomeService, $scope, $uibModal){
	$scope.open = function(){
		var modalInstance = $uibModal.open({
			animation : true,
			templateUrl: 'modules/home/views/modal.html',
			controller: 'modalCtrl',
			size: 'lg',
			resolve: {
				dataModal: function(){
					return true;
				},
			},
		});
	}

	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle === true ? false : true;
	};

	$scope.appointments = {};
	$scope.totalItem = 0;
	$scope.searchObject = {
		Limit: 5,
		Offset: 0,
		currentPage: 1,
		maxSize: 5,
		Filter: [
			{Appointment: {Enable: 'Y'}},
			{TelehealthAppointment: {Type: 'TEL'}},
		],
		Search:[
			{PatientAppointment: {FullName: null}},
			{Doctor: {FullName: null}},
		],
		Range:[{
			Appointment:{
				CreatedDate:[null,null],
				FromTime: [null,null],
			},
		}],
	};

	$scope.init = function(){
		parseTime($scope.searchObject);
		LoadList($scope.searchObject);
	};

	function parseTime(data){
		if(data.Range[0].Appointment.FromTime[0] !== null && data.Range[0].Appointment.FromTime[0] !== undefined){
			data.Range[0].Appointment.FromTime[0] = moment(data.Range[0].Appointment.FromTime[0]).format('YYYY-MM-DD Z');
		}
		if(data.Range[0].Appointment.FromTime[1] !== null && data.Range[0].Appointment.FromTime[1] !== undefined){
			data.Range[0].Appointment.FromTime[1] = moment(data.Range[0].Appointment.FromTime[1]).format('YYYY-MM-DD Z');
		}
	};

	$scope.SetPage = function(){
		$scope.searchObject.Offset = ($scope.searchObject.currentPage - 1)*$scope.searchObject.Limit; 
		parseTime($scope.searchObject);
		LoadList($scope.searchObject);
	};

	function LoadList(params){
		HomeService.getListAppointment(params)
			.then(function(res){
				$scope.appointments = res.rows;
				$scope.totalItem = res.count;
			},function(err){});
	};

	$scope.OpenModal = function(UID, size){
		var data = [];
		var modalInstance;
		HomeService.getDetailAppointment(UID)
			.then(function(res){
				data = res.data;
				console.log('caigiday',data);
				modalInstance = $uibModal.open({
					animation : true,
					templateUrl: 'modules/home/views/modal.html',
					controller: 'modalCtrl',
					size: size,
					resolve: {
						dataModal: function(){
							return data;
						},
					},
				});
				modalInstance.result
					.then(function(result){
						alert('result '+result);
					},function(result){
						// alert('dismiss');
					});
			}, 
			function(err){
				console.log('Loi ne',err);
			});
	};
	
	$scope.init();
});


// scope.searchObject = {
//     Limit: 20,
//     Offset: 0,
//     currentPage: 1,
//     maxSize: 5,
//     Filter: [{
//         Appointment: {
//             Enable: 'Y'
//         }
//     }, {
//         TelehealthAppointment: {
//             Type: 'TEL'
//         }

//     }],
//     Order: [{
//         Appointment: {
//             CreatedDate: 'DESC',
//             FromTime: null
//         }
//     }],
//     Search: [{
//         PatientAppointment: {
//             FullName: null
//         }
//     }, {
//         Doctor: {
//             FullName: null
//         }
//     }],
//     Range: [{
//         Appointment: {
//             CreatedDate: [null, null],
//             FromTime: [null, null]
//         }
//     }]
// };