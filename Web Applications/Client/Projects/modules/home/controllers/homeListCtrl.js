var app = angular.module('app.authentication.home.list.controller',[]);

app.controller('homeListCtrl', function($scope,$cookies, $state){
	$scope.UserRole = $cookies.getObject('userInfo').roles[0].RoleCode;
	$scope.ListTodayConsultation = function(){
		$state.go("authentication.consultation.list",{roleid:'roleid'});
	}
});






