angular.module('app.authentication.doctor.directive.group', [])
.directive('doctorGroup', function(doctorService, CommonService, $rootScope, $cookies, toastr, $uibModal, $timeout, $state) {

	return {
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/group.html',
		scope: {
		},
		link: function(scope, ele, attrs) {
			scope.doctorgroups = [];
			scope.count;
			scope.fieldSort={};
			scope.search = {};
			scope.fieldSort['GroupCode']='ASC';
			scope.fieldSort['GroupName']='ASC';
			scope.fieldSort['Enable']='ASC';
			function loadlistGroup(data) {
				doctorService.loadlistGroup(data)
				.then(function(response) {
					console.log("response ",response);
					for(var i = 0; i < response.rows.length; i++) {
						response.rows[i].stt =  scope.searchObjectMap.offset*1 + i + 1;
					}
					scope.doctorgroups = response.rows;
					scope.count = response.count;
				},function(err) {
					console.log("err ",err);
				})
			};

            scope.init = function() {
				scope.searchObject = {
	                limit: 5,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                search:null,
	                order: null
	            };
				scope.searchObjectMap = angular.copy(scope.searchObject);
				loadlistGroup(scope.searchObjectMap);
            };

			scope.setPage = function() {
				scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
				loadlistGroup(scope.searchObjectMap);
			};

			scope.sort = function(field,sort) {
				scope.isClickASC = false;

				if(sort==="ASC"){
					scope.isClickASC = true;
					scope.fieldSort[field]= 'DESC';
				}
				else{
					scope.isClickASC = false;
					scope.fieldSort[field]= 'ASC';
				}
				var data = field+" "+sort;
				scope.searchObjectMap.order = data;
				loadlistGroup(scope.searchObjectMap);
			};

			scope.Search = function(data,e){

				if(e==13){
					scope.searchObjectMap.search = data;
					loadlistGroup(scope.searchObjectMap);
				}
			};

			scope.setData = function(name) {
				if(scope.search[name] == null || scope.search[name] == '') {
					delete scope.search[name];
				}
			};

            scope.viewDetail = function(group) {
                $state.go('authentication.doctor.groupDetail', {uid:group.UID});
            };

			scope.create = function() {
				var modalInstance = $uibModal.open({
					templateUrl: 'createGroupModal',
					controller: function($scope){
						$scope.success = function() {
							toastr.success("Create Successfully");
							modalInstance.close();
							loadlistGroup(scope.searchObjectMap);
						};
						$scope.close = function() {
							modalInstance.dismiss('cancel');
						};
					},
					// windowClass: 'app-modal-window'
					size: 'lg',
				});

			};

			scope.changeStatus = function(uid, Enable) {
				swal({
					title: "Change Status Group",
					text: "Do you want change status this group?" ,
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
						doctorService.changeStatusGroup({UID:uid,Enable:Enable})
						.then(function(response) {
							toastr.success("Change Status Successfully.");
							loadlistGroup(scope.searchObjectMap);
						},function(err) {
							console.log(err);
						})
					}
				});
			};

			scope.init();
		}

	}

});
