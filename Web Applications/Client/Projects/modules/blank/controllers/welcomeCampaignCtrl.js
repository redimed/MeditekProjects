var app = angular.module('app.blank.welcomeCampaignCtrl.controller', []);
app.controller('welcomeCampaignCtrl', function($scope,$state) {
	$scope.Registration = function(){
		$state.go('blank.registerPatientCampaign')
	}
});
