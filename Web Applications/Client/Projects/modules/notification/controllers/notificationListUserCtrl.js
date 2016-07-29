var app = angular.module("app.authentication.notification.user.list.controller", []);

app.controller('notificationListUserCtrl', function($scope, AuthenticationService, $modalInstance) {
    $scope.selectUsers = [];
    $scope.cb = [];
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.loadListDoctor = function(fullname) {
        console.log("loadListDoctor");
        AuthenticationService.getListDoctor({
            Search: {
                FullName: (fullname) ? fullname : null
            },
            attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
            isAvatar: true,
            RoleID: [4, 5]
        }).then(function(data) {
            console.log(data);
            $scope.listDoctor = data.data;
        }, function(err) {
            console.log("err", err);
        });
    };

    $scope.loadListDoctor();

    $scope.pushUser = function(doctor) {
        if ($scope.cb[doctor.UserAccount.UID] === true) {
            $scope.selectUsers.push(doctor.UserAccount.UID);
        } else {
            var index = $scope.selectUsers.indexOf(doctor.UserAccount.UID);
            $scope.selectUsers.splice(index, 1);
        };
    };

    $scope.submit = function() {
        if ($scope.selectUsers) {
            var info = {
                message: 'senddata',
                userList: $scope.selectUsers
            };
            $modalInstance.close(info);
        }else{
        	alert("Please choose user or close");
        };
    };
});
