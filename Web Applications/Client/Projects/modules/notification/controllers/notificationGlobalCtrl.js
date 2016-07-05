var app = angular.module("app.authentication.notification.global.controller",[
    "app.authentication.notification.global.detail.controller",
]);

app.controller('notificationGlobalCtrl', function($scope, $uibModal){
	$scope.openDetail = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            size: 'lg', // windowClass: 'app-modal-window', 
            templateUrl: 'modules/notification/views/notificationGlobalDetail.html',
            resolve: {
            },
            controller: 'notificationGlobalDetailCtrl',
        });
        modalInstance.result
            .then(function(result) {
            }, function(result) {
            });
    };
});