var app = angular.module('app.authentication.admission.controller', [
    'app.authentication.admission.request.controller',
    'app.authentication.admission.detail.controller',
]);
app.controller('admissionCtrl', function($state, $stateParams, $scope) {
    if (!$scope.wainformation) {
    	if($state.current.name.indexOf('detail1') != -1)
        	$state.go("authentication.consultation.detail1", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient }, { reload: true });
        else
        	$state.go("authentication.consultation.detail", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient }, { reload: true });
    }
});
