var app = angular.module('app.authentication.eForm.home.controller',[
]);

app.controller('eFormHomeCtrl', function($scope){
        $scope.eFormBaseUrl = o.const.eFormBaseUrl;
        $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eformDev');
});