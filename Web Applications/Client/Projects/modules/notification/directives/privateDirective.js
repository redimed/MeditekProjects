var app = angular.module('app.authentication.notification.directive.private', []);

app.directive('notificationPrivate', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/private.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, toastr, $cookies) {
            var UserInfo = $cookies.getObject('userInfo');
            var userUID = UserInfo.UID;
            var queue = 'NOTIFY';

            notificationServices.getListNotify({
                userUID: userUID,
                queue: queue
            }).then(function(data) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                    // data.data[i].CreatedDate = new Date(data.data[i].CreatedDate);
                    // data.data[i].time = (Date.now() - data.data[i].CreatedDate).toHHMMSS();
                };
                console.log("listNotify", data.data);
                console.log("listNotify", data.count);
                $scope.listNotify = data.data;
                $scope.UnReadCount = data.count;
            });
        }
    };
});
