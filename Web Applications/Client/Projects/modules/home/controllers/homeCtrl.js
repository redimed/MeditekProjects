var app = angular.module('app.authentication.home.controller',[
	'app.authentication.home.list.controller',
	'app.authentication.home.detail.controller',
]);

app.controller('homeCtrl', function($state){
	// $state.go('authentication.home.list');
});