var app = angular.module("app.authentication.notification.global.create.controller", []);

app.controller('notificationGlobalCreateCtrl', function($scope, $modalInstance, toastr, notificationServices, $cookies) {
    $scope.Advanced = false;
    $scope.submitText = 'Create';

    $scope.Role = [{
        id: 'ADMIN',
        role: 'Admin'
    }, {
        id: 'PATIENT',
        role: 'Patient'
    }, {
        id: 'INTERNAL_PRACTITIONER',
        role: 'Internal'
    }, {
        id: 'EXTERTAL_PRACTITIONER',
        role: 'Extertal'
    }, {
        id: 'ASSISTANT',
        role: 'Assistant'
    }, {
        id: 'ORGANIZATION',
        role: 'Organization'
    }];

    $modalInstance.rendered.then(function() {
        App.initAjax();
        ComponentsDateTimePickers.init();
    });

    var userInfo = $cookies.getObject('userInfo');

    $scope.ShowAdvanced = function() {
        if ($scope.Advanced === true) {
            $scope.Advanced = false;
        } else {
            $scope.Advanced = true;
        };
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.submit = function(info) {
        console.log(info.Role);
        // var Today = moment(new Date());
        // var Delay = moment(info.FirstDelay, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
        // var FirstDelay = moment.duration(Today.diff(Deplay));

        // console.log("|||||||||||||||||||||||||||", Delay);
        // console.log("|||||||||||||||||||||||||||", -(FirstDelay.asSeconds()));

        // var now = moment(new Date()); //todays date
        // var end = moment("2015-12-1"); // another date
        // var duration = moment.duration(now.diff(end));
        // var days = duration.asDays();
        // console.log("it", days);

        // console.log("|||||||||||||||||||||||||||", moment.duration(FirstDelay));

        notificationServices.validate(info).then(function(data) {
            if (data.Status = 'success') {
                if (info.FirstDelay) {
                    var Today = moment(new Date());
                    var Delay = moment(info.FirstDelay, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                    var FirstDelay = moment.duration(Today.diff(Delay));
                    info.FirstDelay = parseInt(-(FirstDelay.asSeconds()));
                };
                info.Role = data.Role;
                info.MsgKind = 'Global';
                info.UID = userInfo.UID;
                info.UserName = userInfo.UserName;
                info.EndTime = moment(info.EndTime, 'DD/MM/YYYY 23:59').format('YYYY-MM-DD 23:59');
                notificationServices.SendMsgGlobal(info).then(function(result) {
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
});
