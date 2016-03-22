var app = angular.module("app.authentication.consultation.detail.telehealth.controller", []);
app.controller('TelehealthDetailController', function($scope, $state, $stateParams) {
    $scope.runWhenFinish = {
    	success:function () {
    		$state.go($state.current, {UID:$stateParams.UID,UIDPatient:$stateParams.UIDPatient}, {reload: true});
    	}
    };
});
