angular.module('app.common.menuBar',[])
.directive('menuBar',function(Restangular,$cookies){
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

			// var test=api.one('user-account/test');
			// test.withHttpConfig({
			// 	responseType:'arraybuffer',
		 //        // headers: {'Content-Type': 'image/jpg'}
		 //        headers: {'Authorization': 'Bearer '+$cookies.get('token')}
			// })
			// test.get()
			// .then(function(res,status,headers,config){
			// 	console.log(headers);
	  //       	var blob = new Blob([res],{type:'arraybuffer'});
	  //       	// var blob = new Blob([res], {type: 'image/jpg'});
	  //       	scope.objectUrl = URL.createObjectURL(blob);

	  //       	//download blob
	  //       	// window.open($scope.objectUrl);

	  //       	var anchor = document.createElement("a");
			// 	// anchor.download='';//se lay ten mat dinh
			// 	anchor.download='hehehe.pdf';
			// 	anchor.href = scope.objectUrl;
			// 	anchor.click();
				
				
			// },function(err){
			// 	console.log(err);
			// })
		},

		controller:function($scope,$http,$cookies)
		{
			// var config = {
		 //        method: 'GET',
		 //        url: "http://localhost:3005/api/user-account/test",
		 //        responseType:'arraybuffer',
		 //        // headers: {'Content-Type': 'image/jpg'}
		 //        headers: {'Authorization': 'Bearer '+$cookies.get('token')}
		 //    };
		 //    $http(config)
		 //    .then(function(res){
		 //    	console.log(">>>>>>>>>>>>>>>>>.");
		 //    	console.log(res.headers());
	  //       	var blob = new Blob([res.data]);
	  //       	// var blob = new Blob([res], {type: 'image/jpg'});
	  //       	$scope.objectUrl = URL.createObjectURL(blob);

	  //       	//download blob
	  //       	// window.open($scope.objectUrl);

	  //       	var anchor = document.createElement("a");
			// 	// anchor.download='';//se lay ten mat dinh
			// 	anchor.download='hehehe.pdf';
			// 	anchor.href = $scope.objectUrl;
			// 	anchor.click();
		 //    },function(err){

		 //    })

	   //      .success(function(res, status, headers, config){
	   //      	console.log(">>>>>>>>>>>>>>>>>.");
	   //      	console.log(headers());
	   //      	var blob = new Blob([res]);
	   //      	console.log(res);
	   //      	// var blob = new Blob([res], {type: 'image/jpg'});
	   //      	$scope.objectUrl = URL.createObjectURL(blob);

	   //      	//download blob
	   //      	// window.open($scope.objectUrl);

	   //      	var anchor = document.createElement("a");
				// // anchor.download='';//se lay ten mat dinh
				// anchor.download='hehehe.pdf';
				// anchor.href = $scope.objectUrl;
				// anchor.click();
	   //      })
	   //      .error(function(res){});
		}
	}
})