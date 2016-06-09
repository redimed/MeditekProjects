angular.module('app.common.menuBar',[])
.directive('menuBar',function(Restangular,$cookies,CommonService){
	return {
		restrict:'E',
		scope:{

		},
		templateUrl:'common/directives/menuBar.html',
		controller: function(){
			
		},
		link:function(scope,element,attrs){
			Layout.initSidebar(); // init sidebar
			var api = Restangular.all("api");
			var result = api.one("module/GetModulesForUser");
			result.get()
			.then(function(data){
				console.log(data.data);
				scope.menus=data.data.nodes;
			},function(err){
				
			});

			/*scope.test=function()
			{
				CommonService.test()
				.then(function(data){
					alert(JSON.stringify(data));
				},function(err){
					alert(JSON.stringify(err));
				})
			}*/

			/*CommonService.downloadFile('bb965155-2b92-41f8-aa78-aa072e70b452')
			.then(function(data){
				// alert(data.status);
			},function(err){
				// alert("Loi roi");
			})
			CommonService.getFileURL('bb965155-2b92-41f8-aa78-aa072e70b452')
			.then(function(url){
				scope.objectUrl=url;
			},function(err){
				
			})
			CommonService.openImageInNewTab('bb965155-2b92-41f8-aa78-aa072e70b452')
			.then(function(success){
				alert("success roi ne")
			},function(err){

			})
			console.log($cookies.get('token'));*/
		}
	}
})