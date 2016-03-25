var app = angular.module('app.authentication.admission.controller', [
    'app.authentication.admission.request.controller',
    'app.authentication.admission.detail.controller',
]);
app.controller('admissionCtrl', function($state, $stateParams, $scope) {
    if (!$scope.wainformation) {
        $state.go("authentication.consultation.detail", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient }, { reload: true });
    }
});
