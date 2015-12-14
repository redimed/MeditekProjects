var app = angular.module('app.authentication.consultation.call.controller',[
]);
app.controller('consultationCallCtrl', function($scope){
    $scope.toggle = false;
    $scope.Skype = function(){
        $scope.toggle = $scope.toggle === false ? true : false;
    };
});