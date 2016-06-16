var app = angular.module('app.authentication.patient.list.directive',[]);
app.directive('patientList', function(PatientService, $uibModal, toastr,$cookies, $state){
	return {
		scope :{
			items:'=onItem',
			isShowCreateButton:'=onCreate',
			isShowSelectButton:'=onSelect',
			uidReturn:'=',
			appointment:'=',
			staff:'=onStaff',
			limit:'=onLimit',
			compid:'=onCompid',
			roleid:'=onRoleid',
			ishaveusername:'=isHaveUsername',
			iscompanycreate:'=isCompanyCreate',
			company:'=onCompany',
			autofilter:'=onAutofilter',
		},
		restrict: "EA",
		link: function(scope, elem, attrs){
			console.log("company ",scope.company);
			scope.ishaveusername = scope.ishaveusername?scope.ishaveusername:false;
			scope.iscompanycreate = scope.iscompanycreate?scope.iscompanycreate:false;
			scope.fieldSort={};
			scope.search  = {};
			scope.checked = {};
			scope.flag = 13;
			scope.fieldSort;
			scope.itemDefault = [
				{field:"FirstName",name:"First Name"},
				{field:"LastName",name:"Last Name"},
				{field:"Gender",name:"Gender"},
				{field:"UserAccount",name:"Mobile"},
				{field:"Email1",name:"Email"}
			];
			scope.EnableChoose = [
				{id:null,name:"All"},
				{id:"Y",name:"Enable"},
				{id:"N",name:"Disable"}
			];
			//check user add data items into directive
			if(scope.items){
				if(!scope.items.hasOwnProperty('field') || !scope.items.hasOwnProperty('name')){
					scope.items = scope.itemDefault;
				}
			}
			else{
				scope.items = scope.itemDefault;
			}

			for(var i = 0; i < scope.items.length; i++){
				scope.fieldSort[scope.items[i].field]='ASC';
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
	                limit: isNaN(scope.limit)?20:scope.limit,
	                offset: 0,
	                currentPage: 1,
	                maxSize: 5,
	                attributes:scope.items,
	                Search:null,
	                order: null
	            };
	            scope.search.Enable = null;
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.toggle = false;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};
			// var aaa = {
			// 	FirstName:"Giang",
			// 	LastName:"Vo",
			// 	MiddleName:"Truong",
			// 	PhoneNumber:"+61432657849",
			// 	DOB:"24/12/2015"
			// };
			// PatientService.postDatatoDirective(aaa);
			scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.clickOpen = function(patientUID,Enable, Actived){
				var modalInstance = $uibModal.open({
					templateUrl: 'patientListmodal',
					controller: function($scope){
						$scope.ID = patientUID;
						$scope.enable = Enable;
						$scope.active = Actived;
						$scope.close = function() {
							scope.loadList(scope.searchObjectMap);
							modalInstance.close();
						};
					},
					windowClass: 'app-modal-window'
					//size: 'lg',
				});
			};

			scope.Search = function(data,e){
				if(e==13){
					if(data.UserAccount || data.UserAccount==''){

						data.PhoneNumber = data.UserAccount;
					}
					scope.searchObjectMap.Search = data;
					scope.loadList(scope.searchObjectMap);
				}
			};

			scope.sort = function(field,sort) {
				if(sort==="ASC"){
					scope.fieldSort[field] = "DESC";
				}
				else{
					scope.fieldSort[field] = "ASC";
				}
				if(field=='UserAccount'){
					field = 'PhoneNumber';
				}

				var data = field+" "+sort;
				scope.searchObjectMap.order = data;
				scope.loadList(scope.searchObjectMap);
			};

			scope.selectPatient = function(patientUID,stt,Enable,FirstName,LastName){
				if(scope.isShowSelectButton){
					console.log(FirstName);
					if(Enable=='Y'){
						if(scope.appointment) {

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
									scope.appointment.runIfSuccess({UID:patientUID,FirstName:FirstName,LastName:LastName});
								}else{
									scope.uidReturn='';
									scope.checked = false;
									scope.loadList(scope.searchObjectMap);
								}
							});
						}
						else if(scope.staff) {
							scope.uidReturn=patientUID;
							swal({
								title: "Are you sure?",
								text: "Are you want to link this patient to the current company?" ,
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
									scope.staff.runIfSuccess({UID:patientUID,FirstName:FirstName,LastName:LastName});
								}else{
									scope.uidReturn='';
									scope.checked = false;
									scope.loadList(scope.searchObjectMap);
								}
							});
						}
						else {
							if(scope.uidReturn==patientUID){
								scope.uidReturn='';
								scope.checked = false;
							}
							else{
								scope.checked = true;
								scope.uidReturn=patientUID;
							}
						}
					}
					else {
						sweetAlert("Error.", "Patient Disable!", "error");;
					}
				}

			};

			scope.createPatient= function () {
				if (scope.appointment) {
					var modalInstance = $uibModal.open({
						templateUrl: 'patientCreatemodal',
						controller: function($scope,$modalInstance){
							$scope.iscompanycreate = scope.iscompanycreate;
							$scope.company = scope.company;
							$scope.check = scope.ishaveusername;
							$scope.compid = scope.compid;
							$scope.role = scope.roleid?true:false;
							$scope.roleid = scope.roleid?scope.roleid:null;
							$scope.close = function() {
								$modalInstance.close();
							};
							$scope.appointment = {
								runIfSuccess : function (data) {
									$modalInstance.close({status:'success',data:data});
								},
								runIfClose : function () {
									$modalInstance.close();
								}
							};
						},
						windowClass: 'app-modal-window'
						//size: 'lg',
					});
					modalInstance.result.then(function (data) {
						if (data && data.status == 'success') {
				      		scope.appointment.runIfSuccess(data.data);
						};
				    });
				}
				else if (scope.staff) {
					var modalInstance = $uibModal.open({
						templateUrl: 'patientCreatemodal',
						controller: function($scope,$modalInstance){
							// $scope.rolecompany = true;.
							$scope.iscompanycreate = scope.iscompanycreate;
							$scope.company = scope.company;
							$scope.check = scope.ishaveusername;
							$scope.compid = scope.compid;
							$scope.role = scope.roleid?true:false;
							$scope.roleid = scope.roleid?scope.roleid:null;
							$scope.close = function() {
								$modalInstance.close();
							};
							$scope.staff = {
								runIfSuccess : function (data) {
									$modalInstance.close({status:'success',data:data});
								},
								runIfClose : function () {
									$modalInstance.close();
								}
							};
						},
						windowClass: 'app-modal-window'
						//size: 'lg',
					});
					modalInstance.result.then(function (data) {
						if (data && data.status == 'success') {
				      		if(!scope.compid)
				      			scope.staff.runIfSuccess(data.data);
				      		else
				      			scope.staff.createSuccess(data.data);
						};
				    });
				}else{
					$state.go('authentication.patient.create');
				}
			};

			scope.init();

			if(scope.autofilter) {
				scope.search = scope.autofilter;
				scope.Search(scope.search, 13);
			}
		},
		templateUrl:"modules/patient/directives/template/patientList.html"
	};
});
