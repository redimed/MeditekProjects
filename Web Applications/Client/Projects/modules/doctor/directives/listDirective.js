angular.module('app.authentication.doctor.directive.list', [])
.directive('doctorList', function(doctorService, $filter, $uibModal, $state, toastr) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/list.html',
		options: {
			scope: '=',
			reload: '='
		},
		link: function(scope, ele, attr) {
			scope.search = {};
			scope.EnableChoose = [
				{id:null,name:"All"},
				{id:"Y",name:"Enable"},
				{id:"N",name:"Disable"}
			];
			scope.typeDoctor = [
				{id:null,name:"All"},
				{id:"Admin",name:"Admin"},
				{id:"GP",name:"GP"}
			];
			scope.fieldSort={};
			scope.itemDefault = [
				{field:"FirstName",name:"First Name"},
				{field:"LastName",name:"Last Name"},
				{field:"UserAccount",name:"Mobile"},
				{field:"Email",name:"Email"}
			];
			scope.items = scope.items!=null&&scope.items!=undefined?scope.items:scope.itemDefault;
			for(var i = 0; i < scope.items.length; i++){
				scope.fieldSort[scope.items[i].field]='ASC';
			};

			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};

			scope.loadList = function(info){
				doctorService.loadlistDoctor(info).then(function(response){
					if(response.message=="success"){
						scope.doctors = response.data;
						for(var i = 0; i < response.data.length;i++){
							scope.doctors[i].stt = scope.searchObjectMap.offset*1 + i + 1;
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
	                limit: 20,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                attributes:scope.items,
	                Search:null,
	                order: null
	            };
	            // scope.search.Enable = null;
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.Search = function(data,e){

				if(e==13){
					scope.searchObjectMap.Search = data;
					scope.loadList(scope.searchObjectMap);
				}
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
				if(field=='UserAccount'){
					field = 'PhoneNumber';
				}
				if(field=='Role'){
					field = 'RoleName';
				}
				var data = field+" "+sort;
				scope.searchObjectMap.order = data;
				scope.loadList(scope.searchObjectMap);
			};

			scope.clickOpen = function(uid) {
				var data = {uid:uid};
				doctorService.detailDoctor(data)
				.then(function(response){
						var modalInstance = $uibModal.open({
						templateUrl: 'doctorModal',
						controller: function($scope,detail){
							$scope.data = detail;

							doctorService.getSpecialities()
							.then(function(result){
								$scope.special = angular.copy(result.data);
							},function(err){
								console.log(err);
							});
							$scope.close = function() {
								modalInstance.close();
								scope.loadList(scope.searchObjectMap);
							};
						},
						resolve: {
			                detail: function () {
			                	response.data.Speciality = [];
								for(var i = 0; i < response.data.Specialities.length; i++){
									response.data.Speciality.push(response.data.Specialities[i].ID);
								}
								delete response.data['Specialities'];
						    	return response.data;
						    }
			            },
						windowClass: 'app-modal-window'
					});
					
				},function(err){
					console.log(err);
				});
			};

			scope.createDoctor = function(){
				$state.go("authentication.doctor.create", null, {
                        reload: true
                    });
			}

			scope.init();

		} // end link

	} // end return

})