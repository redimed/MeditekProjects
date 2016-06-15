var app = angular.module('app.blank.controller', [
    'app.blank.services',
    'app.blank.call.controller',
    'app.blank.receive.controller',
    'app.blank.registerPatient.controller',
    'app.blank.searchPatient.controller',
    'app.blank.welcomeCampaignCtrl.controller',
    'app.blank.registerPatientCampaign.controller'
]);

app.controller('blankCtrl', function($scope, AuthenticationService, toastr) {
    $scope.joinRoomCall = function(teleCallUID) {
        socketTelehealth.get('/api/telehealth/socket/joinroomcall', {
            teleCallUID: teleCallUID,
            message: 'joinroom'
        }, function(data) {
            console.log("Join Room", data);
        });
    };
    
    $scope.loadListDoctor = function(fullname) {
        //EXTERNAL
        AuthenticationService.getListDoctor({
            Search: {
                FullName: (fullname) ? fullname : null
            },
            attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
            isAvatar: true,
            RoleID: [4]
        }).then(function(data) {
            $scope.listDoctorExternal = data.data;
        });

        //INTERNAL  
        AuthenticationService.getListDoctor({
            Search: {
                FullName: (fullname) ? fullname : null
            },
            attributes: [{ "field": "FirstName" }, { "field": "LastName" }, { "field": "MiddleName" }],
            isAvatar: true,
            RoleID: [5]
        }).then(function(data) {
            $scope.listDoctorInternal = data.data;
        });
    };
});
