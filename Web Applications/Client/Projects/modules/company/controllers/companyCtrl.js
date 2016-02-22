var app = angular.module('app.authentication.company.controller',[
	'app.authentication.company.home.controller',
	'app.authentication.company.list.controller',
	'app.authentication.company.detail.controller',
	'app.authentication.company.create.controller',
]);

app.controller('companyCtrl', function(){
	console.log('companyCtrl');
});