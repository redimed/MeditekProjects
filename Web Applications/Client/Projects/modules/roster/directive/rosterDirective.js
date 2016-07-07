var app = angular.module('app.authentication.roster.directive',[]);
app.directive('rosterDirective', function(){	
	return {
		restrict: 'EA',
		templateUrl:'modules/roster/directive/template/rosterDirective.html',
		controller: function($scope, RosterService, $state){
			$scope.search = {};			
			$scope.data = {};
			$scope.typeDoctor = [{
		        id: {$or:["INTERNAL_PRACTITIONER", "ADMIN", "ASSISTANT"]},
		        name: "All"
		    }, {
		        id: "ADMIN",
		        name: "Admin"
		    }, {
		        id: "INTERNAL_PRACTITIONER",
		        name: "Internal"
		    }, {
		    	id: "ASSISTANT",
		    	name: "Assistant"
		    }];
		    $scope.itemDefault = [{
		    	field: "UserName",
		    	name: "UserName"
		    }, {
		        field: "FirstName",
		        name: "First Name"
		    }, {
		        field: "LastName",
		        name: "Last Name"
		    }, {
		        field: "PhoneNumber",
		        name: "Mobile"
		    }, {
		        field: "Email",
		        name: "Email"
		    }];
		    $scope.fieldSort = {};
		    $scope.items = $scope.items != null && $scope.items != undefined ? $scope.items : $scope.itemDefault;
		    for (var i = 0; i < $scope.items.length; i++) {
	        	$scope.fieldSort[$scope.items[i].field] = 'ASC';
		    };

		    $scope.toggle = false;
		    $scope.toggleFilter = function() {
		        $scope.toggle = $scope.toggle === false ? true : false;
		    };
		    $scope.loadList = function(info) {
		           console.log("aaaaaaaaaaaaaaaaaaaa",info);
		        RosterService.GetStaffList(info).then(function(response) {
		        	$scope.doctors = response.rows;
		        	for (var i = 0; i < response.rows.length; i++) {
	                    $scope.doctors[i].stt = $scope.searchObjectMap.Offset * 1 + i + 1;
	                    for (var j = 0; j < $scope.doctors[i].Roles.length; j++) {
	                    	if ($scope.doctors[i].Roles[j].RoleCode === 'ADMIN' || 
	                    		$scope.doctors[i].Roles[j].RoleCode === 'INTERNAL_PRACTITIONER' || 
	                    		$scope.doctors[i].Roles[j].RoleCode === 'ASSISTANT') {
	                    			$scope.doctors[i].RoleCode = $scope.doctors[i].Roles[j].RoleCode;
	                    	};
	                    };
	                };
	                $scope.count = response.count;
		        },function(err){
		        	console.log("err",err);
		        });
		    };

		    $scope.init = function() {
		        $scope.data = {
					  Limit: 20,
					  Offset: 0,
					Search: [
					    {
					      UserAccount: {
					      	UserName:null,
					      	PhoneNumber:null,
					      	Email:null
					      }
					  	},
					    {
					    	Doctor: {
						      	FirstName:null,
						      	LastName:null
					      }
					    }
					],
					Filter: [
					    {
					      UserAccount: {
					        Enable: "Y"
					      }
					    },
					    {
					      Role: {
					        RoleCode: {
					        	$or:["ADMIN", "ASSISTANT", "INTERNAL_PRACTITIONER"]
					        }
					      }
					    }
					],
					Order: [
						{
							UserAccount: {
								UserName: null,
								PhoneNumber: null,
								Email:null
							}
						},
						{
							Doctor: {
								FirstName:null,
					      		LastName:null
							}
						}						
					]
				};
		        $scope.searchObjectMap = angular.copy($scope.data);

		        $scope.loadList($scope.searchObjectMap);
		    };
		    $scope.setPage = function() {
		        $scope.searchObjectMap.Offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.Limit;
		        $scope.loadList($scope.searchObjectMap);
		    };

		    $scope.Search = function(field, e) {
		        _.forEach($scope.searchObjectMap.Search, function(search_v, search_i){
		        	if(!_.isEmpty(search_v)){
		        		for(var keyModel in search_v){
		        			if (!_.isEmpty(search_v[keyModel])) {
		        				for(var key in search_v[keyModel]){
		        					if (key && key == field) {
		        						if (e == 13) {
		        							$scope.searchObjectMap.Search[search_i][keyModel][key]=$scope.search[key];
		        						}
		        					}		        							        							        			
		        				}
		        			}
		        		}
		        	}
		        });
		        $scope.loadList($scope.searchObjectMap);
		        
		    };
		    $scope.sort = function(field, sort) {
		    	$scope.isClickASC = false;
		    	//loop Order 
		    	_.forEach($scope.searchObjectMap.Order, function(order_v, order_i){
		    		if(!_.isEmpty(order_v)) {
		    			for(var keyModel in order_v) {
		    				if(!_.isEmpty(order_v[keyModel])) {
		    					for(var key in order_v[keyModel]) {
				    				if(key &&
				    					key==field) {				    					
				    					$scope.searchObjectMap.Order[order_i][keyModel][key] = sort;
				    					console.log("$scope.searchObjectMap.Order[order_i][keyModel][key]", $scope.searchObjectMap.Order[order_i][keyModel][key])
				    					if ($scope.searchObjectMap.Order[order_i][keyModel][key] == "ASC") {
				    						$scope.isClickASC = true;
				    						$scope.fieldSort[field] = 'DESC';
				    					}
				    					else {
				    						$scope.isClickASC = false;
				    						$scope.fieldSort[field] = 'ASC';
				    					}
				    				}
				    				else if(key) {
				    					$scope.searchObjectMap.Order[order_i][keyModel][key] = null;
				    				}
		    					}
		    				}
		    			}
		    		}
		    	});
		    	$scope.loadList($scope.searchObjectMap);
		    };
		    $scope.clickDoctor = function(uid) {
		        var data = {
		            uid: uid
		        };
		        $state.go("authentication.roster.calendar", {doctorId: uid});
		        
		    };

		    $scope.createDoctor = function() {
		        $state.go("authentication.doctor.create", null, {
		            reload: true
		        });
		    }
		    $scope.init();
		}
	}
});