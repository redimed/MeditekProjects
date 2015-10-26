angular.module('app.common.menuBar',[])
.directive('menuBar',function(Restangular){
	return {
		restrict:'E',
		scope:{

		},
		templateUrl:'common/directives/menuBar.html',
		link:function(scope,element,attrs){

			var api = Restangular.all("api");
			var result = api.one("module/GetModulesForUser");
			result.get()
			.then(function(data){
				console.log(data.data);
				scope.menus=data.data.nodes;
			},function(err){

			});
		}
	}
})