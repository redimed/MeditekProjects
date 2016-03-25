var app = angular.module('app.blank.registerPatientCampaign.controller', []);
app.controller('registerPatientCampaignCtrl', function($scope, $timeout) {
	$scope.typedoctor = 'typedoctor';
	$timeout(function(){
		document.body.className = "full-background-compaign";
	},0);
});
