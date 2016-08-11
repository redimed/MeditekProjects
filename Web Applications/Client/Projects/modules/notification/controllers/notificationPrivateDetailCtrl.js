var app = angular.module("app.authentication.notification.private.detail.controller", []);

app.controller('notificationPrivateDetailCtrl', function($scope, $modalInstance, data, $cookies, notificationServices) {
    var userInfo = $cookies.getObject('userInfo');
    var OldState = data.MsgState;
    $scope.data = data;
    $scope.submitText = '';

    $scope.cancel = function() {
        $modalInstance.close('cancel');
    };

    if ($scope.data.MsgKind) {
        if ($scope.data.MsgKind === 'ToDo') {
            $scope.status = [
                { field: "Create", name: "Create" },
                { field: "InProcess", name: "In Process" },
                { field: "Done", name: "Done" },
                { field: "Pending", name: "Pending" },
                { field: "Cancel", name: "Cancel" },
            ];
        } else {
            $scope.status = [
                { field: "WaitingApproval", name: "Waiting Approval" },
                { field: "Approval", name: "Approval" },
                { field: "Disapproval", name: "Disapproval" },
                { field: "Cancel", name: "Cancel" },
            ];
        }
    };

    if (userInfo.UID === data.SenderUID) {
        if (data.Status === 'HANDLED') {
            $scope.submitText = 'Remove';
        } else if (data.Status === 'DELAY') {
            $scope.submitText = 'Stop';
        }
    };

    $scope.submit = function() {
        if ($scope.data.Enable === 'Y') {
            var textShow = '';
            if ($scope.submitText === 'Remove') {
                textShow = 'You will remove this data in nofication list for receiver!';
            };
            if ($scope.submitText === 'Stop') {
                textShow = 'You will turn off nofication to receiver!';
            };
            swal({
                title: "Are you sure?",
                text: textShow,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel plx!",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function(isConfirm) {
                if (isConfirm) {
                    var info = {
                        ID: $scope.data.ID,
                        Enable: 'N'
                    };
                    notificationServices.ChangeEnableQueueJob(info).then(function(info) {
                        $modalInstance.close('close');
                    });
                };
                swal.close();
            });
        } else {
            swal("Please check again !", "Removed", "warning");
        };
    };

    $scope.update = function() {
        if ($scope.data.MsgState != OldState) {
            var info = {
                ID: $scope.data.ID,
                MsgState: $scope.data.MsgState,
            };
            notificationServices.UpdateStatusQueueJob(info).then(function(info) {
                $modalInstance.close('close');
            });
        } else {
            swal("Please change!", "Change", "warning");
        };
    };
});
