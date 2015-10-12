var app = angular.module('app.lockScreen',[
	"app.authentication.home"
]);

app.controller('lockScreenCtrl', function($scope, $state, $timeout){
	$scope.login = function(){
		$timeout(function(){
            $state.go('authentication.home.list');
        },100);
	};
	
});