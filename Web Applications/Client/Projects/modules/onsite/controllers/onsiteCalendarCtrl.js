var app = angular.module('app.authentication.onsite.calendar.controller', []);

app.controller('onsiteCalendarCtrl', function($scope, $modalInstance, getItem, bookingType, appDate, appTime) {
    //console.log(getItem);
    $scope.item = getItem;
    $scope.type = bookingType;
    $scope.date = appDate;
    $scope.time = appTime;
    $modalInstance.rendered.then(function() {
        App.initAjax();
        ComponentsDateTimePickers.init();
    });
    $scope.Cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.Save = function() {};
});
