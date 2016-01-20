var app = angular.module("app.authentication.consultation.detail.controller", [
    'app.authentication.consultation.detail.patientAdmission.controller',
    'app.authentication.consultation.detail.consultNote.controller',
    'app.authentication.consultation.detail.eForms.controller',
    'app.authentication.consultation.directives.consultNoteDirectives'
]);
app.controller('consultationDetailCtrl', function($scope, $cookies, $state, $http, consultationServices, WAAppointmentService, $stateParams, AdmissionService, $q, toastr) {
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        // Request the camera.
        navigator.getUserMedia(
            // Constraints
            {
                video: true
            },

            // Success Callback
            function(localMediaStream) {
                console.log("camera support");
            },

            // Error Callback
            function(err) {
                // Log the error to the console.
                console.log('The following error occurred when trying to use getUserMedia: ' + err);
            }
        );

    } else {
        console.log("Aaaaaaaaaaaaaaaa");
        alert('Sorry, your browser does not support getUserMedia');
    }
    $scope.Params = $stateParams;
    console.log("$scope.Params", $scope.Params.UID);
    $scope.getTelehealthDetail = function(UID) {
        WAAppointmentService.getDetailWAAppointmentByUid(UID).then(function(data) {
            $scope.wainformation = data.data;
            console.log("$scope.wainformation", $scope.wainformation);
        }, function(error) {});
    };
    $scope.getTelehealthDetail($scope.Params.UID);

    /*=========opentok begin=========*/
    $scope.userInfo = $cookies.getObject('userInfo');
    var audio = new Audio('theme/assets/global/audio/ringtone.mp3');
    console.log(" $scope.userInfo", $scope.userInfo);

    function OpentokSendCall(uidCall, uidUser) {
        console.log("uidCall", uidCall);
        console.log("uidUser", uidUser);
        io.socket.get('/api/telehealth/socket/messageTransfer', {
            from: uidUser,
            to: uidCall,
            message: "call",
            sessionId: $scope.Opentok.sessionId,
            fromName: $scope.userInfo.UserName
        }, function(data) {
            console.log("send call", data);
        });
    };

    $scope.opentokData = {
            userName: null,
            userCall: null,
            call: function() {
                console.log("Opentok", $scope.Opentok);
                WAAppointmentService.GetDetailPatientByUid({
                    UID: $scope.wainformation.Patients[0].UID
                }).then(function(data) {
                    console.log(data);
                    if (data.data[0].TeleUID != null) {
                        $scope.opentokData.userCall = data.data[0].TeleUID;
                        $scope.opentokData.userName = data.data[0].FirstName + " " + data.data[0].LastName;
                        // swal({
                        //     title: $scope.opentokData.userName,
                        //     imageUrl: "theme/assets/global/images/E-call_33.png",
                        //     timer: 10000,
                        //     showConfirmButton: false,

                        // }, function(isConfirm) {
                        //     if (isConfirm) {
                                
                        //     } else {
                        //         audio.pause();
                        //         swal.close();
                        //         console.log("1111111111111");
                        //     };
                        // });
                        // audio.loop = true;
                        // audio.play();
                        
                        // return

                        // console.log(audio);

                        OpentokSendCall($scope.opentokData.userCall, $scope.userInfo.UID);
                        window.open($state.href("blank.call", {
                            apiKey: $scope.Opentok.apiKey,
                            sessionId: $scope.Opentok.sessionId,
                            token: $scope.Opentok.token,
                            userName: $scope.opentokData.userName
                        }));
                        console.log($scope.opentokData.userName);
                        console.log($scope.opentokData.userCall);
                    } else {

                    };
                });
            }
        }
        /*=========opentok end=========*/

    /*==addmission star==*/
    $scope.admissionDetail = {};
    $scope.admissionInfo = {
        appointmentAdmission: {
            Filter: [{
                Appointment: {
                    UID: $scope.Params.UID
                },
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        },
        patientAdmission: {
            Filter: [{
                Patient: {
                    UID: $scope.Params.UIDPatient
                }
            }],
            Order: [{
                Admission: {
                    ID: 'DESC'
                }
            }]
        }
    }

    function promiseGetListAdmission(data) {
        var deferred = $q.defer();
        AdmissionService.GetListAdmission(data).then(function(data) {
            deferred.resolve(data);
        }, function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function setDetailAdmission(input, output) {
        _.forEach(input, function(value, name) {
            var itemData = null;
            if (value.Name == "PREVIOUS_SURGERY_PROCEDURES" || value.Name == "MEDICATIONS") {
                itemData = JSON.parse(value.Value);
            } else {
                itemData = value.Value;
            };
            output[value.Name] = itemData;
        });
    }

    var apptAdmission = promiseGetListAdmission($scope.admissionInfo.appointmentAdmission);
    apptAdmission.then(function(data) {
            if (data.count > 0) {
                $scope.admissionUID = data.rows[0].UID;
                setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                console.log('$scope.admissionApptDetail', $scope.admissionDetail);
                return "success";
            };
            return "error";
        }, function(error) {
            console.log(error);
        })
        .then(function(data) {
            console.log(data)
            if (data == 'error') {
                promiseGetListAdmission($scope.admissionInfo.patientAdmission).then(function(data) {
                    console.log("1111", data);
                    if (data.count > 0) {
                        setDetailAdmission(data.rows[0].AdmissionData, $scope.admissionDetail);
                    };
                    console.log('$scope.admissionPatientDetail', $scope.admissionDetail);
                });
            };
        });
    /*==addmission end==*/
    $scope.eForms = function(){
        $state.go("authentication.eForms.appointment");
    };
    $scope.admission = function(){
        $state.go("authentication.consultation.detail.admission.detail");
    };
    $scope.consultNote = function(){
        $state.go("authentication.consultation.detail.consultNote");
    };
    $scope.telehealthDetail = function(){
        $state.go("authentication.consultation.detail.telehealth");
    };
});
