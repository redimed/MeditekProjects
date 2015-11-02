var app = angular.module("app.authentication.urgentCare.list.controller", [	
	"app.authentication.urgentCare.list.directive",
	"app.authentication.urgentCare.detail.directive",
	"app.authentication.urgentCare.list.detail.controller",
]);

app.controller('urgentCareListCtrl', function(){
	console.log('urgentCare List controller');
});