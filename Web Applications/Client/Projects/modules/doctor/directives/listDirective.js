angular.module('app.authentication.doctor.directive.list', [])
.directive('doctorList', function(doctorService, $filter, $modal, $state) {

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
				sortFisrtName: 'DESC',
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
					console.log(scope.doctor.list);
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
					case 'sortFisrtName' : {
						scope.doctor.search.sortFisrtName = options.sort;
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

			// Variable
			scope.doctor = {

				count: 0,
				list: [],
				search: angular.copy(search),
				loading: false,
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

			// Modal
			scope.openModalDoctor = function(UID){
				var modalInstance = $modal.open({
					animation : true,
					templateUrl: 'modules/doctor/views/doctorModal.html',
					controller: function($scope, $modalInstance) {
						$scope.modal_close = function(){
							$modalInstance.close();
						}
						$scope.close = function(){
							$modalInstance.close();
						}
					},
					windowClass: 'app-modal-window',
					resolve: {
						data: function(){
							return UID;
						}
					}
				});
			};

			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			}
			// End Modal

			// Reload Data
			scope.$watch('reload', function(reload) {
				if(reload) {
					scope.doctor.search = angular.copy(search);
					scope.doctor.load();
				}
			})

		} // end link

	} // end return

})