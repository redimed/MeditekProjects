var app = angular.module('app.authentication.user.controller',[
	'app.authentication.user.list.controller',
	'app.authentication.user.detail.controller',
	'app.authentication.user.profile.controller',
]);

app.controller('userCtrl', function(){
	console.log('userCtrl');
});