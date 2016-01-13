var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);

app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams,toastr) {
    console.log($stateParams.UID);
    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            console.log('responseData', data);
            $scope.wainformation = data.data;
        }, function(error) {
            toastr.error("Select error!", "error");
        });
    };
    $scope.getTelehealthDetail($stateParams.UID);

    /*=========opentok begin=========*/
    $scope.userInfo = $cookies.getObject('userInfo');
    console.log(" $scope.userInfo", $scope.userInfo);
    var apiKey = null;
    var sessionId = null;
    var token = null;
    var userName = null;
    var userCall = null;

    function OpenTokJoinRoom() {
        io.socket.get('/api/telehealth/socket/joinRoom', {
            uid: $scope.userInfo.UID
        }, function(data) {
            console.log("JoinRoom", data);
        });
    };

    OpenTokJoinRoom();

    function OpentokCreateSession() {
        WAAppointmentService.getDetailOpentok().then(function(data) {
            console.log(data.data);
            apiKey = data.data.apiKey;
            sessionId = data.data.sessionId;
            token = data.data.token;
        });
    };

    OpentokCreateSession();

    function OpentokSendCall(uidCall, uidUser) {
        console.log("uidCall", uidCall);
        console.log("uidUser", uidUser);
        io.socket.get('/api/telehealth/socket/messageTransfer', {
            from: uidUser,
            to: uidCall,
            message: "call",
            sessionId: sessionId,
            fromName: $scope.userInfo.UserName
        }, function(data) {
            console.log("send call", data);
        });
    };

    $scope.opentokCall = function() {
        WAAppointmentService.GetDetailPatientByUid({
            UID: $scope.wainformation.Patients[0].UID
        }).then(function(data) {
            console.log(data);
            if (data.data[0].TeleUID != null) {
                userCall = data.data[0].TeleUID;
                userName = data.data[0].FirstName + " " + data.data[0].LastName;
                OpentokSendCall(userCall, $scope.userInfo.UID);
                window.open($state.href("blank.call", {
                    apiKey: apiKey,
                    sessionId: sessionId,
                    token: token,
                    userName: userName
                }));
            } else {

            };
        });
    };
    /*=========opentok end=========*/

});
