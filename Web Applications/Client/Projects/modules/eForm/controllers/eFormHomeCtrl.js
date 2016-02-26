var app = angular.module('app.authentication.eForm.home.controller',[
]);

app.controller('eFormHomeCtrl', function($scope){
        $scope.eFormBaseUrl = o.const.eFormBaseUrl;
        var contentHeight = $('.page-content').height()-80;
        $('#eformDev').attr('src', $scope.eFormBaseUrl+'/#/eformDev');
        $('#eformDev').attr('height', contentHeight);
});