var app = angular.module('app.authentication.user.profile.controller',[
]);

app.controller('userProfileCtrl', function($scope, PatientService,$cookies){
	var UID = $cookies.getObject("userInfo").UID;
});