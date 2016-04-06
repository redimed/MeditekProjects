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
                paging: {
                    currentPage: 1,
                    itemsPerPage: 5,
                    maxSize: 2
                },
                data: {
                    Limit: 5,
                    Offset: 0,
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
            }
            $scope.loadListAdmission = function() {
                $scope.info.data.Offset = ($scope.info.paging.currentPage - 1) * $scope.info.paging.itemsPerPage;
                console.log("aaaaaaaaaaaaaaaaaaaaaaaa", $scope.info.data.Offset);
                AdmissionService.GetListAdmission($scope.info.data).then(function(data) {
                    console.log("chien list addmission ne", data);
                    $scope.info.listAdmission = data;
                }, function(error) {

                });
            }
            $scope.loadListAdmission();
        }
    };
})
