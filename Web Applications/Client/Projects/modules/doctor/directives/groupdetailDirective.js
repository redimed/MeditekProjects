angular.module('app.authentication.doctor.directive.group.detail', [])
.directive('doctorGroupDetail', function(doctorService, CommonService, $rootScope, $cookies, toastr, $uibModal, $timeout, $stateParams) {

	return {
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/groupdetail.html',
		scope: {
			uid:'=onUid',
			info:'=onData',
		},
		link: function(scope, ele, attrs) {
			scope.info = scope.info?scope.info:{};
			scope.uid = $stateParams.uid;
			scope.doctors = [];
			function loadDoctor(uid) {
				doctorService.loadlistDoctorfromGroup({doctorGroupUID:uid})
				.then(function(result) {
					console.log("????????????????", result);
					for (var i = 0; i < result.data.length; i++) {
						if(result.data[i].Enable === "Y")
						{
							scope.doctors.push(result.data[i]);
						}
					}
					
				},function(err) {
					console.log(err);
				});
			};

			function getDetailGroup() {
				doctorService.getDetailGroup({UID:scope.uid})
				.then(function(response) {
					console.log(response);
					scope.info = response.data;
					loadDoctor(scope.uid);
				},function(err){
					console.log(err);
				});
			};

			getDetailGroup();

			scope.addDoctor = function() {
				var modalInstance = $uibModal.open({
					templateUrl: 'linkDoctor',
					controller: function($scope){
						$scope.isLink = true;
						$scope.runSuccess = function(response) {
							console.log("response ",response);
							doctorService.addDoctor({doctorUID:response.UID,doctorGroupUID:scope.uid})
							.then(function(result) {
								console.log(result);
								loadDoctor(scope.uid);
								toastr.success('Add Doctor Successfully.');
								modalInstance.close();

							},function(err) {
								console.log(err);
								var errData = err.data;
								for(var i = 0; i < errData.ErrorsList.length; i++) {
									if(errData.ErrorsList[i] == "Doctor.Added.Group") {
										toastr.error('Doctor has existed in Group.');
									}
									if(errData.ErrorsList[i] == "Not.Internal") {
										toastr.error('Please choose doctor Internal Practitioner');
									}
								}
							})
						};
						$scope.close = function() {
							modalInstance.dismiss('cancel');
						};
					},
					windowClass: 'app-modal-window'
				});
			};

			scope.deleteDoctor = function(doctor) {
				// deleteDoctorfromGroup
				swal({
					title: "Delete User",
					text: "Do you want delete this doctor?" ,
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					cancelButtonText: "Cancel",
					closeOnConfirm: true,
					closeOnCancel: true
				},
				function(isConfirm){
					if (isConfirm) {
						doctorService.deleteDoctorfromGroup({doctorID:doctor.ID,doctorGroupID:scope.info.ID})
						.then(function(response) {
							loadDoctor(scope.uid);
							toastr.success("Delete Successfully");
						},function(err) {
							console.log(err);
							toastr.error("Delete Error");
						});
					}
				});
			};

			scope.updateInfo = function() {
				var modalInstance = $uibModal.open({
					templateUrl: 'updateInfo',
					controller: function($scope){
						$scope.data = scope.info;
						$scope.close = function() {
							modalInstance.dismiss('cancel');
						};
						$scope.success = function() {
							toastr.success("Update Successfully.");
							getDetailGroup();
							modalInstance.close();
						};
					},
					size:'lg',
					// windowClass: 'app-modal-window'
				});
			};

		}

	}

});
