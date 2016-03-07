var app = angular.module('app.authentication.eForm.appointment.controller',[
]);

app.controller('eFormAppointmentCtrl', function($scope, $stateParams, $cookies, EFormService, $state){
            var postData = {
                    Filter: [
                            {
                                EFormTemplate: {
                                    Enable: 'Y'
                                }
                            }
                    ]
            }
            EFormService.PostListEFormTemplate(postData)
            .then(function(response){
                    $scope.eformTemplates = response.data.rows;
            }, function(error){
                    
            })

            $scope.eFormTemplate = function(eformTemplate) {
                $state.go("authentication.consultation.detail.eForm.LoadForm", { UID: $stateParams.UID, UIDPatient: $stateParams.UIDPatient,  UIDFormTemplate: eformTemplate.UID});
            };
});