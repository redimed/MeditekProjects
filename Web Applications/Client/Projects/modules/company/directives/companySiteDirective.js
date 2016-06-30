var app = angular.module('app.authentication.company.site.directive',[]);

app.directive('companySite', function($uibModal, $timeout, $state, companyService, toastr, doctorService){
	return {
		restrict: 'E',
		scope:{
			uid :'=onUid',
			compuid:'=onComp',
			type:'=onType',
			loadagain:'=onLoadAgain',
			cancel:'=onCancel'
		},
		templateUrl: 'modules/company/directives/templates/companySiteDirective.html',
		link: function(scope, elem, attrs){
			scope.erlist = {};
			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];
			doctorService.listCountry()
			.then(function(response){
				scope.country = response;
			},function(err){
				console.log(err);
			});
			console.log(scope.compuid);
			scope.data = {};
			console.log(scope.uid," ",scope.type);
			if(scope.uid != null && scope.uid != '' && scope.type == 'update') {
				companyService.loadDetail({model:'CompanySite',UID:scope.uid})
				.then(function(response) {
					console.log(response);
					response.data.Country = parseInt(response.data.Country);
					scope.data = response.data;
					scope.data.data_medic = [];
					scope.data.data = {};				

				},function(err) {
					console.log(err);
				});
			}
			console.log(scope);
			scope.click = function() {
				if(scope.type != 'delete'){
					companyService.validate(scope.data,true)
					.then(function(result) {

						if (scope.type == 'create') {
							scope.data.Enable = 'Y';
							companyService.create({info:scope.data, CompanyUID:scope.compuid, model:'CompanySite'})
							.then(function(response) {
								console.log(response);
								toastr.success("Create Successfully","success");
								scope.cancel();
								scope.loadagain();
							},function(err) {
								console.log(err);
								toastr.error("Please check information","error");
							});
						}
						else if (scope.type == 'update') {
							companyService.update({info:scope.data, model:'CompanySite'})
							.then(function(response) {
								console.log(response);
								toastr.success("Update Successfully","success");
								scope.cancel();
								scope.loadagain();
							},function(err) {
								console.log(err);
								toastr.error("Please check information","error");
							});
						}
						else {
							console.log("type error");
						}

					},function(err) {
						console.log(err);
						for(var i = 0; i < err.length; i++) {
							scope.erlist[err[i].field] = {};
							scope.erlist[err[i].field].style = { 'border': '2px solid #DCA7B0' };
							scope.erlist[err[i].field].msg = err[i].message;
						}
					});
				}
				else {
					scope.data.Enable = scope.uid.Enable=='Y'?'N':'Y';
					scope.data.UID = scope.uid.UID;
					companyService.changestatus({whereClauses:{UID:scope.data.UID},info:{Enable:scope.data.Enable}, model:'CompanySite'})
					.then(function(response) {
						console.log(response);
						toastr.success("Delete Successfully","success");
						scope.cancel();
						scope.loadagain();
					},function(err) {
						console.log(err);
						toastr.error("Delete Error","error");
					});
				}
			};
			
			scope.clearOther = function(text) {
        		for (var i = 0; i < text.length; i++) {            	
            		scope.data.data[text[i]] = '';
       			}
    		};

			scope.openModalMedic = function(type, data){				
				console.log(" data ", data)
				var modalInstance = $uibModal.open({
		            animation: true,
		            size: 'md',
		            templateUrl: 'modules/company/directives/templates/companyMedicDirective.html',
		            resolve: {
		                data_medic: function() {
		                    return data;
		                },
		            },
		            controller: function($scope, data_medic){
		            	console.log("data_medic ", data_medic)
		            	$scope.titleModal = type;
		            	$scope.dataModal = {};
		            	if(type == 'update'){
		            		console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>data_medic', data_medic);
		            		$scope.dataModal = angular.copy(data_medic);	        
		            	}     	
		            	$scope.cancel = function() {
		            		closeModal();
		            	};
		            	$scope.submit = function(){
		            		if(type == 'add') {
		            			scope.data.data_medic.push({
		            				medic:$scope.dataModal.medic,
		            				contact_number_onsite:$scope.dataModal.contact_number_onsite
		            			});
		            			closeModal();
		            		}
		            		else if(type == 'update') {
		            			console.log("index ",scope.data.data_medic.indexOf(data_medic));
		            			var index = scope.data.data_medic.indexOf(data_medic);
		            			if(index != -1) {
		            				scope.data.data_medic[index] = $scope.dataModal;
		            			}
		            		}
		            		closeModal();
		            	};
		            },
		            
		        });
		        modalInstance.result
		            .then(function(result) {
		            	
		                // scope.data.data.data_medic = result;
		            }, function(result) {

		                //
		            });
				function closeModal() {
					modalInstance.close();
				}
			};

		},
	};
});