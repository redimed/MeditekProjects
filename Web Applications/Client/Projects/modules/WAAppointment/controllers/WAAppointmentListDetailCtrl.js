var app = angular.module('app.authentication.WAAppointment.detail.controller', []);
app.controller('showImageController', function($scope, $modalInstance, toastr, LinkUID, CommonService) {

    $scope.$watch('dimageStatus', function(newValue, oldValue) {
        if (newValue == 'finished') {
            o.loadingPage(false);
        };
        if (newValue == 500) {
            o.loadingPage(false);
            toastr.error("Couldn't open image");
            $modalInstance.dismiss('cancel');
        };
        if (newValue == 401) {
            o.loadingPage(false);
            $modalInstance.close(401);
        };
    });
    $scope.LinkUID = LinkUID;
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.Vieww = function(LinkUID) {
        o.loadingPage(true);
        CommonService.openImageInNewTab(LinkUID)
            .then(function(data) {
                o.loadingPage(false);
            }, function(er) {
                if (er.status == 401) {
                    $modalInstance.close(401);
                    o.loadingPage(false);
                } else {
                    toastr.error("Couldn't open image");
                    o.loadingPage(false);
                };
            });
    };
});
app.controller('WAAppointmentListDetailCtrl', function($state, $scope, $stateParams) {
    $scope.runWhenFinish = {
        success:function () {
            $state.go($state.current, {UID:$stateParams.UID}, {reload: true});
        }
    };
    
});
