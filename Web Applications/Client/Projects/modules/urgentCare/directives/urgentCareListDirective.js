var app = angular.module('app.authentication.urgentCare.list.directive',[]);

app.directive('urgentcareList', function(urgentCareService, $uibModal, toastr,$cookies, $state, $timeout){
	return {
		scope :{
			item:'=onItem'
		},
		restrict: "EA",
		templateUrl: 'modules/urgentCare/directives/templates/urgentCareList.html',
		link: function(scope, elem, attrs){
			console.log($state);
			$timeout(function(){
				App.initAjax();
    			ComponentsDateTimePickers.init(); // init todo page
			},0);
			scope.data ={};
			scope.search = {};
			scope.flag = 13;
			scope.status = [
				{id:'confirmed',name:'Confirmed'},
				{id:'spending',name:'Not Responded'},
				{id:'pending',name:'Pending'}
			];
			scope.items = [
				{field:'FirstName'},
				{field:'LastName'},
				{field:'UrgentRequestType'},
				{field:'RequestDate'},
				{field:'PhoneNumber'},
				{field:'Suburb'},
				{field:'Status'}
			];
			scope.fieldSort={};
			for(var i = 0; i < scope.items.length; i++){
				scope.fieldSort[scope.items[i].field]='DESC';
			};
			scope.toggle = true;
			scope.toggleFilter = function(){
				scope.toggle = scope.toggle === false ? true : false;
			};

			scope.loadList = function(info){
				urgentCareService.loadlist(info).then(function(response){
					console.log("pppppppppppppppppppppppp", response);
					if(response.message=="success"){
						scope.urgent = response.data;
						for(var i = 0; i < response.data.length;i++){
							scope.urgent[i].stt = scope.searchObjectMap.offset*1 + i + 1;
							scope.urgent[i].RequestDate = moment(scope.urgent[i].RequestDate).format('DD/MM/YYYY HH:mm:ss');
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
	            scope.searchObjectMap = angular.copy(scope.searchObject);
	            scope.loadList(scope.searchObjectMap);
	        };

			scope.setPage = function() {
	            scope.searchObjectMap.offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.limit;
	            scope.loadList(scope.searchObjectMap);
	        };

	        scope.Search = function(data,e){
				if(e==13){
					for(var key in data) {
						if(data[key] == '') {
							data[key] = null;
						}
						if(typeof data[key] == 'object') {
							for(var childKey in data[key]) {
								if(data[key][childKey] == ''){
									delete data[key][childKey];
								}
							}
							if(_.isEmpty(data[key])) {
								delete data[key];
							}
						}
					}
					console.log("daat ", data);
					scope.searchObjectMap.Search = data;
					scope.loadList(scope.searchObjectMap);
				}
			};

			scope.clickDetail = function(uid){
				var data = {UID:uid};
				urgentCareService.detailUrgentRequest(data)
				.then(function(response){
						var modalInstance = $uibModal.open({
						templateUrl: 'urgentCareDetail',
						controller: function($scope,detail){
							$scope.data = detail;
							$scope.close = function() {
								modalInstance.close();
								scope.loadList(scope.searchObjectMap);
							};
						},
						resolve: {
			                detail: function () {
						    	return response.data;
						    }
			            },
						windowClass: 'app-modal-window'
					});
					
				},function(err){
					console.log(err);
				});
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
				scope.loadList(scope.searchObjectMap);
			};

	        scope.init();

		},
	};
});