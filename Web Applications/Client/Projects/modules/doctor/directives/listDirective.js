angular.module('app.authentication.doctor.directive.list', [])
.controller('ModalDoctor', function($scope, $modalInstance, list) {

	// cancel
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}
	
	// Variable
	$scope.doctor = {
		id: list.UID,
		accid: list.UserAccountID, // UserAccountID
		depid: list.DepartmentID, // DepartmentID
		success: false
	}

	$scope.$watch('doctor.success', function(success) {
		if(success)
			$modalInstance.close('success');
	})

})

.directive('doctorList', function(doctorService, $filter, $modal, $state, toastr) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/list.html',
		options: {
			scope: '=',
			reload: '='
		},
		link: function(scope, ele, attr) {

			//information data
			var search = {

				page:1,
				limit: 15,
				offset: 0,
				max_size: 5,
				FirstName: '',
				LastName: '',
				Email: '',
				PhoneNumber: '',
				sortFirstName: 'DESC',
				sortLastName: 'DESC',
				sortEmail: 'DESC'

			}

			// Set page
			scope.setPage = function(page) {
				scope.doctor.search.offset = (page-1)*scope.doctor.search.max_size;
				scope.doctor.load();
			}

			// Load
			var load = function() {
				
				var data = angular.copy(scope.doctor.search);
				doctorService.getList(data)
				.then(function(response) {
					scope.doctor.list = response.data.rows;
					scope.doctor.count = response.data.count;
					angular.forEach(response.data.rows, function(value, index) {
						doctorService.getroleDoctor(response.data.rows[index].UserAccountID)
						.then(function(responsies) {
							if( responsies == '' || responsies == null || responsies == undefined ) {
								scope.doctor.typies = '';
							} else{
								scope.doctor.typies = responsies.Role.RoleName;
							}
						}, function(error) {});
					});
					
				}, function(error) {})

			}

			// Search
			var onSearch = function() {
				scope.doctor.search.offset = 0;
				scope.doctor.load();
				scope.doctor.search.page = 1;
			}

			// Sort
			var sortBy = function(options) {
				switch(options.field) {
					case 'sortFirstName' : {
						scope.doctor.search.sortFirstName = options.sort;
						break;
					}
					case 'sortLastName': {
						scope.doctor.search.sortLastName = options.sort;
						break;
					}
					case 'sortEmail': {
						scope.doctor.search.sortEmail = options.sort;
						break;
					}
				}
				scope.doctor.load();
			}

			// Modal Detail
			var editModal = function(list){
				$modal.open({
					templateUrl: 'doctorModal',
					controller: 'ModalDoctor',
					windowClass: 'app-modal-window',
					resolve: {
						list: function() {
							return list;
						},

					}
				})
				.result.then(function(response) {
					if(response === 'success') {
						toastr.success('Update Successfully');
						scope.doctor.load();
					}
				})
			};

			// End Modal

			// Variable
			scope.doctor = {

				count: 0,
				list: [],
				typies: '',
				search: angular.copy(search),
				loading: false,
				dialog: {
					editModal: function(list) {
						editModal(list);
					}
				},
				load: function(){ 
					load();
				},
				onSearch: function() {
					onSearch();
				},
				sortBy: function(options) {
					sortBy(options);
				}

			}

			// Load data
			scope.doctor.load();

			// Reload Data
			scope.$watch('reload', function(reload) {
				if(reload) {
					scope.doctor.search = angular.copy(search);
					scope.doctor.load();
				}
			})

			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			}

		} // end link

	} // end return

})