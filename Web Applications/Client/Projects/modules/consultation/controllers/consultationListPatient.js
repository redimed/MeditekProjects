var app = angular.module("app.authentication.consultation.listPatient.controller", []);

app.controller('consultationListPatient', function($scope, $state, consultationServices,$cookies) {
   // $scope.patientuid = $cookies.getObject('userInfo').UID;
   $scope.patientuid = 'f255e9b9-1846-4f6f-9007-16a7da5f8b65';
});
