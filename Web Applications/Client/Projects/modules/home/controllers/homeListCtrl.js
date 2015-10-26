var app = angular.module('app.authentication.home.list.controller',[
	'app.authentication.home.list.detail.controller'
]);

app.controller('homeListCtrl', function($scope){
	console.log('homeListCtrl');
	$scope.testDialog=function()
	{
		$scope.data.showDialog()
			.then(function(data){
				switch(data){
					case 'yes':
						alert("yes ne");
					break;
					case 'no':
						alert("no ne");
					break;
					case 'cancel':
						alert("cancel ne");
					break;
					case 'ok':
						alert("ok ne");
					break;
				}
			},function(err){
				alert(err);
			});
	};
});

app.directive('myDirective', function () {
    return {
        template : 'dsdsd',
    }
});