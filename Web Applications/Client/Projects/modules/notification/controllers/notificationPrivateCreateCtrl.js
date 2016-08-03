var app = angular.module("app.authentication.notification.private.create.controller", []);

app.controller('notificationPrivateCreateCtrl', function($scope, $modalInstance, toastr, notificationServices, $cookies, $uibModal) {
    $scope.now = true;
    $scope.submitText = 'Create';
    $scope.lsDoctor = [];
    $scope.lsPatient = [];
    $scope.private = {};

    $modalInstance.rendered.then(function() {
        App.initAjax();
        ComponentsDateTimePickers.init();
    });

    var userInfo = $cookies.getObject('userInfo');

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.submit = function(info) {
        if ($scope.lsDoctor) {
            info.lsUser = $scope.lsDoctor.concat($scope.lsPatient);
        } else if ($scope.lsPatient) {
            info.lsUser = $scope.lsPatient.concat($scope.lsDoctor);
        };

        console.log("List", info.lsUser);
        notificationServices.validate(info, "private").then(function(data) {
            if (data.Status = 'success') {
                if (info.FirstDelay) {
                    var Today = moment(new Date());
                    var Delay = moment(info.FirstDelay, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                    var FirstDelay = moment.duration(Today.diff(Delay));
                    info.FirstDelay = parseInt(-(FirstDelay.asSeconds()));
                } else {
                    info.FirstDelay = 0;
                };
                info.MsgKind = 'Private';
                info.UID = userInfo.UID;
                info.UserName = userInfo.UserName;
                // info.EndTime = moment(info.EndTime, 'DD/MM/YYYY 23:59').format('YYYY-MM-DD 23:59');
                notificationServices.SendMsgPrivate(info).then(function(result) {
                    toastr.success("Send message success", "Success");
                    $modalInstance.close('close');
                });
            };
        }, function(err) {
            for (var i = 0; i < err.length; i++) {
                toastr.error(err[i].field + " is " + err[i].message, "Error");
            };
        });
    };

    $scope.loadListUser = function() {
        var modalInstance = $uibModal.open({
            animation: true,
            // size: 'lg', // windowClass: 'app-modal-window', 
            templateUrl: 'modules/notification/views/notificationListUser.html',
            resolve: {},
            controller: 'notificationListUserCtrl',
        });
        modalInstance.result.then(function(result) {
            if (result.message === "senddata") {
                $scope.ListUser = result.userList;
            };
        }, function(err) {
            console.log("Global.Notification.Create", err);
        });
    };

    $scope.GetDoctor = function(arr) {
        $scope.lsDoctor = arr;
    };

    $scope.GetPatient = function(arr) {
        $scope.lsPatient = arr;
    };
});
