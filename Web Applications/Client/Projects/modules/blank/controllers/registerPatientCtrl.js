var app = angular.module('app.blank.registerPatient.controller', []);
app.controller('registerPatientCtrl', function($scope, blankServices, AuthenticationService, toastr, $state, $cookies, $rootScope, CommonService, $timeout) {
	$timeout(function(){
		document.body.className = "full-background";
	},0);
});
