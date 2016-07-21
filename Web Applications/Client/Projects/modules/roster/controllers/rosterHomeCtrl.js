var app = angular.module('app.authentication.roster.home.controller', []);

app.controller('rosterHomeCtrl', function($scope, $state, doctorService, $cookies) {
	var roles = $cookies.getObject('userInfo').roles;
	$scope.isDoctor = false;
    var userUID = $cookies.getObject('userInfo').UID;
    console.log("rosterUID", $cookies.getObject('userInfo'))
    for (var i = 0; i < roles.length; i++) {
     	if (roles[i].RoleCode === "INTERNAL_PRACTITIONER" || roles[i].RoleCode === "EXTERTAL_PRACTITIONER"){

     		$scope.isDoctor = true;
     		$state.go("authentication.roster.calendar", {doctorId: userUID});     		
     	}
    } 
});