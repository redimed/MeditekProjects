var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);
app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService) {
    console.log($scope.Opentok);
    $scope.Params = $stateParams;
    console.log("$scope.Params",$scope.Params.UID);
    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            console.log("$scope.wainformation", $scope.wainformation);
        }, function(error) {});
    };
   $scope.getTelehealthDetail($scope.Params.UID);

    /*=========opentok begin=========*/
    $scope.userInfo = $cookies.getObject('userInfo');
    console.log(" $scope.userInfo", $scope.userInfo);
    var apiKey = $scope.Opentok.apiKey;
    var sessionId = $scope.Opentok.sessionId;
    var token = $scope.Opentok.token;
    var userName = null;
    var userCall = null;

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
    $scope.admissionDetail = {};
    var data = {
        Filter: [{
            Appointment: {
                UID: $scope.Params.UID
            }
        }],
        Order: [{
            Admission: {
                ID: 'DESC'
            }
        }]
    };
    AdmissionService.GetListAdmission(data).then(function(data) {
        console.log('GetDetailAdmission', data);
        if (data.count > 0) {
            $scope.admissionUID = data.rows[0].UID;
            _.forEach(data.rows[0].AdmissionData, function(value, name) {
                var itemData = null;
                if (value.Name == "PREVIOUS_SURGERY_PROCEDURES" || value.Name == "MEDICATIONS") {
                    itemData = JSON.parse(value.Value);
                } else {
                    itemData = value.Value;
                };
                $scope.admissionDetail[value.Name] = itemData;
            });
            console.log('$scope.admissionDetail', $scope.admissionDetail);
        };

    });
});
