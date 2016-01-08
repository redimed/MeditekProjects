var app = angular.module("app.authentication.consultation.detail.telehealth.controller", []);
app.controller('TelehealthDetailController', function($scope, $state, $stateParams) {
    console.log("TelehealthDetailController", $scope.wainformation);
    if (!$scope.wainformation) {
        $state.go("authentication.consultation.detail");
    };
});
