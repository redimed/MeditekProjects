var app = angular.module('app.authentication.home.list.controller',[]);

app.controller('homeListCtrl', function($scope,$cookies, $state){
	console.log($cookies.getObject('userInfo').UID);
	$scope.UserRole = $cookies.getObject('userInfo').roles[0].RoleCode;
	$scope.ListTodayConsultation = function(){
		 var data = {
            UID: 'roleid'
        };
		$state.go("authentication.consultation.list",{roleid:data.UID});
	}
});






