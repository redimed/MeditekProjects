var app = angular.module('app.authentication.eForm.home.controller',[
]);

app.controller('eFormHomeCtrl', function($scope, $cookies){
        var userUID = $cookies.getObject('userInfo').UID;
        $scope.eFormBaseUrl = o.const.eFormBaseUrl;
        var contentHeight = $('.page-content').height()-80;
        $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eformDev?patientUID='+userUID);
        //$('#eformDev').attr('height', contentHeight);

});