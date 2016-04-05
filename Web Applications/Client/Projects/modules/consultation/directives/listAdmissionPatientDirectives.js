var app = angular.module('app.authentication.consultation.listadmissionpatient.directives', []);
app.directive('listAdmissionPatient', function() {
    return {
        scope: {
            params: "="
        },
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAdmissionPatientDirectives.html",
        controller: function($scope, AdmissionService) {
            $scope.info = {
                Limit: 10,
                Offset: 0,
                currentPage: 1,
                maxSize: 5,
                Filter: [{
                    Patient: {
                        UID: $scope.params.uid
                    }
                }],
                Order: [{
                    Admission: {
                        ID: 'DESC'
                    }
                }]
            }
            $scope.loadListAdmission = function(info) {
                AdmissionService.GetListAdmission(info).then(function(data) {
                    console.log("chien list addmission ne", data);
                    $scope.listAdmission = data.rows;

                }, function(error) {

                });
            }
            $scope.loadListAdmission($scope.info);
        }
    };
})
