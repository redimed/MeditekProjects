var app = angular.module('app.blank.call.controller',[
]);

app.controller('callCtrl', function($scope){
	$scope.toggle = false;
    $scope.zoom = false;
    $scope.size = '900px';
    $scope.src = 'E-call_10.png';
    $scope.listUser = function(){
        $scope.toggle = $scope.toggle === true ? false : true;
    };
    $scope.ZoomScreen = function(size){
    	angular.element(".my-skype").attr("style","width:"+size);
    	$scope.src = $scope.src === 'E-call_10.png' ? 'E-call_09.png' : 'E-call_10.png';
    	$scope.size = $scope.size === '100%' ? '900px' : '100%';
    	$scope.zoom = $scope.zoom === false ? true : false;
    };
});