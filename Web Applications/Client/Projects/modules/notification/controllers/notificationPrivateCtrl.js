var app = angular.module("app.authentication.notification.private.controller",[
    "app.authentication.notification.private.detail.controller",
]);

app.controller('notificationPrivateCtrl', function($scope, $uibModal){
	$scope.openDetail = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg', // windowClass: 'app-modal-window', 
            templateUrl: 'modules/notification/views/notificationPrivateDetail.html',
            resolve: {
            },
            controller: 'notificationPrivateDetailCtrl',
        });
        modalInstance.result
            .then(function(result) {
            }, function(result) {
            });
    };
});