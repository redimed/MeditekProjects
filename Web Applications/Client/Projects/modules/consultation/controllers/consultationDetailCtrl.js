var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
]);

app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices) {
    $scope.userInfo = $cookies.getObject('userInfo');


    var socket = io.connect('http://telehealthvietnam.com.vn:3009');

    console.log(socket);

    socket.on('receiveMessage', function(msg) {
        console.log("aaaaaaaaa", msg);
    });//telehealth/socket/joinRoom?uid=714c45cc-6b58-4e9d-829f-8275b2891ec0

    socket.emit('/api/telehealth/socket/joinRoom', {uid: $scope.userInfo.UID},function(data){
        console.log(data);
    });

    console.log('$scope.userInfo', $scope.userInfo.UID);
    var apiKey = "45432692";
    var sessionId = "1_MX40NTQzMjY5Mn5-MTQ1MDI2MDM3NjIxNH5VZWhSQm40Kzc1NDVudk5HL2ErUFRjL3d-fg";
    var token = null;

    // ConsultationService.CreateToken().then(function(data) {
    //     token = data.data;
    // })

    $scope.Call = function() {
        window.open($state.href("blank.call", {
            apiKey: apiKey,
            sessionId: sessionId,
            token: token
        }));
    };
});
