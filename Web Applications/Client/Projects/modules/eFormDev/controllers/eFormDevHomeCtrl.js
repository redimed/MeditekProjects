var app = angular.module('app.authentication.eFormDev.home.controller',[
]);

app.controller('eFormDevHomeCtrl', function($scope, $cookies){
        var userUID = $cookies.getObject('userInfo').UID;
        $scope.eFormBaseUrl = o.const.eFormBaseUrl;
        $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eformTemplate?userUID='+userUID);
});