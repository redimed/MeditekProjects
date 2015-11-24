var app = angular.module("app.authentication.urgentCare.list.controller", [	
	"app.authentication.urgentCare.list.directive",
	"app.authentication.urgentCare.detail.directive",
	"app.authentication.urgentCare.list.detail.controller",
]);

app.controller('urgentCareListCtrl', function($scope, $uibModal, toastr, $state){
	$scope.item =[
		{field:"FullName",name:"Full Name"},
		{field:"RequestType",name:"Request Type"},
		{field:"RequestDate", name:"Request Time"},
		{field:"PhoneNumber",name:"PhoneNumber"},
		{field:"Suburb",name:"Suburb"},
		{field:"Status",name:"Status"}
	];
});