var app = angular.module('app.authentication.patient.list.directive',[]);
app.directive('patientList', function(PatientService, $uibModal, toastr,$cookies, $state){
	return {
		scope :{
			items:'=onItem',
			isShowCreateButton:'=onCreate',
			isShowSelectButton:'=onSelect',
			uidReturn:'=',
			appointment:'='
		},
		restrict: "EA",
		link: function(scope, elem, attrs){
			scope.search ={};
			scope.fieldSort;
			scope.checked='true';
			scope.itemDefault = [
				{field:"FirstName",name:"Firstname"},
				{field:"LastName",name:"Lastname"},
				{field:"Gender",name:"Gender"},
				{field:"UserAccount",name:"Mobile"},
				{field:"Email",name:"Email"}
			];
			scope.EnableChoose = [
				{id:null,name:"All"},
				{id:"Y",name:"Enable"},
				{id:"N",name:"Disable"}
			];
			scope.items = angular.isArray(scope.items)?scope.items:scope.itemDefault;
			for(var i = 0; i < scope.items.length; i++){
				if(scope.items[i].field=="Enable")
					scope.items.splice(i,1);
			}
			scope.isShowCreateButton = scope.isShowCreateButton?scope.isShowCreateButton:true;
			var userInfo=$cookies.getObject("userInfo");
			scope.enableCreate=false;
			_.each(userInfo.roles,function(role){
				if(['ASSISTANT','ADMIN'].indexOf(role.RoleCode)>=0)
					scope.enableCreate=true;
			})
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
	                limit: 20,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                Search:null,
	                order: null
	            };
	            scope.search.Enable = null;
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

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
				var modalInstance = $uibModal.open({
					templateUrl: 'patientListmodal',
					controller: function($scope){
						$scope.ID = patientUID;
						$scope.close = function() {
							modalInstance.close();
						};
					},
					windowClass: 'app-modal-window'
					//size: 'lg',
				});
			};

			scope.Search = function(data){
				if(data.UserAccount){
					data.PhoneNumber = data.UserAccount;
				}
				scope.searchObjectMap.Search = data;
				scope.loadList(scope.searchObjectMap);

			};

			scope.sort = function(field,sort) {
				scope.isClickASC = false;
				scope.isClickDESC = false;
				scope.fieldSort = field;
				if(field=='UserAccount'){
					field = 'PhoneNumber';
				}
				if(sort==="ASC")
					scope.isClickASC = true;
				else
					scope.isClickDESC = true;
				var data = field+" "+sort;
				scope.searchObjectMap.order = data;
				scope.loadList(scope.searchObjectMap);
			};

			scope.selectPatient = function(patientUID){
				if(!scope.appointment){
					if(scope.uidReturn==patientUID){
						scope.uidReturn='';
					}
					else{
						scope.uidReturn=patientUID;
					}
				}
				else{
					scope.uidReturn=patientUID;
					swal({   
						title: "Are you sure?", 
						text: "Are you want to link this patient to the current appointment?" ,
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
							scope.uidReturn=patientUID;   
							scope.appointment.runIfSuccess({data:{UID:patientUID}});
						}else{

							scope.uidReturn='';
							scope.init();
						}
						console.log(scope.uidReturn);
					});
				}
				
			};

			scope.createPatient= function () {
				if (scope.appointment) {
					var modalInstance = $uibModal.open({
						templateUrl: 'patientCreatemodal',
						controller: function($scope,$modalInstance){
							$scope.close = function() {
								modalInstance.close();
							};
							$scope.appointment = {
								runIfSuccess : function (data) {
									$modalInstance.close({status:'success',data:data});
								}
							};
						},
						windowClass: 'app-modal-window'
						//size: 'lg',
					});
					modalInstance.result.then(function (data) {
				      	scope.appointment.runIfSuccess(data);
				    });
				}else{
					scope.aaaa ="asdasd";
					
					$state.go('authentication.patient.create');
				}
			}

			scope.init();
		},
		templateUrl:"modules/patient/directives/template/patientList.html"
	};
});