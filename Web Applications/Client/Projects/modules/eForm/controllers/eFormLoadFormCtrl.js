var app = angular.module('app.authentication.eForm.loadForm.controller',[
]);

app.controller('eFormLoadFormCtrl', function($scope, $stateParams, $cookies, $state, EFormService, $interval){
    var UserUID = $cookies.getObject('userInfo').UID;
    var AppointmentUID = $stateParams.UID;
    var PatientUID = $stateParams.UIDPatient;
    var TemplateUID = $stateParams.UIDFormTemplate;
    var externalToken = null;
    $scope.eFormBaseUrl = o.const.eFormBaseUrl;
    var contentHeight = $('.page-content').height();
    
    //$('#eform').attr('src', $scope.eFormBaseUrl+'/#/eform/detail?appointmentUID='+AppointmentUID+'&patientUID='+PatientUID+'&templateUID='+TemplateUID+'&userUID='+UserUID);
    //var heightBottom = 150;
    //$('#eform').css('height', contentHeight-heightBottom);

    $scope.eforms = function() {
        $state.go("authentication.consultation.detail.eForm.appointment", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient });
    };

    if(!noEFormAuth) {
        /*$('#eform').on('load', function() {
         /!*var myURL = document.location;
         document.location = myURL + "?a=parameter";*!/
         document.getElementById('eform').contentWindow.postMessage({
         eventName: 'updateNewExternalToken',
         token: externalToken,

         }, 'https://localhost:3014');
         });*/
        EFormService.MakeExternalSecret()
            .then(function(response) {
                if(response.token) {
                    console.log("||||||||||||||||||||||||||||||||| MakeExternalSecret:", response);
                    externalToken = response.token;
                    $('#eform').attr('src', $scope.eFormBaseUrl+'/#/eform/detail?appointmentUID='+AppointmentUID+'&patientUID='+PatientUID+'&templateUID='+TemplateUID+'&userUID='+UserUID+'&ss='+externalToken);
                } else {
                    alert("No external token!");
                }

            }, function(err) {
                alert("Load external token fail!");
                console.log(err);
            });

        var externalTokenInterval = $interval(function() {
            EFormService.GetNewExternalToken()
                .then(function(response) {
                    console.log("|||||||||||||||||||||||||||||| GetNewExternalToken:", response);
                    externalToken = response.token;
                    document.getElementById('eform').contentWindow.postMessage({
                        eventName: 'updateNewExternalToken',
                        token: externalToken
                    }, o.const.eFormBaseUrl);
                })
        }, o.const.externalTokenInterval);

        $scope.stopExternalTokenInterval = function () {
            if (angular.isDefined(externalTokenInterval)) {
                $interval.cancel(externalTokenInterval);
                externalTokenInterval = undefined;
            }
            EFormService.MakeExternalSecret();
        }
        //Khi click qua page khác
        $scope.$on('$destroy', function() {
            $scope.stopExternalTokenInterval();
        });

        //Khi tắt trình duyệt, tắt tab
        window.addEventListener("beforeunload", function (e) {
            $.ajax({
                type: 'POST',
                async: false,
                headers: {
                    'systemtype': 'WEB',
                    'externalname': 'EFORM',
                    'Authorization': ('Bearer ' + $cookies.get("token"))
                },
                xhrFields: {
                    withCredentials: true
                },
                url: o.const.authBaseUrl+'/api/external-token/MakeExternalSecret',
                success: function(data) {
                    alert(JSON.stringify(data));
                    console.log(data);
                },
            })
            /*var confirmationMessage = "\o/";
             (e || window.event).returnValue = confirmationMessage; //Gecko + IE
             return confirmationMessage;                            //Webkit, Safari, Chrome*/
        });
    } else {
        $('#eform').attr('src', $scope.eFormBaseUrl+'/#/eform/detail?appointmentUID='+AppointmentUID+'&patientUID='+PatientUID+'&templateUID='+TemplateUID+'&userUID='+UserUID);
    }
});
