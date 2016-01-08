var app = angular.module('app.authentication.consultation.directives.listAppConsultation', []);
app.directive('listappConsultation', function(consultationServices, $modal, $cookies,$state,$stateParams,toastr) {
    return {
        scope:{
            uid:"="
        },
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppConsultationDirective.html",
         link: function(scope, ele, attr) {

            var Init = function() {
                scope.searchObject = {
                    Limit: 7,
                    Offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    Filter: [{
                        Appointment: {
                            UID:$stateParams.UID
                        }
                    }]
                };
                scope.searchObjectMap = angular.copy(scope.searchObject);
                scope.load();
            };
            scope.Status = {
                apptStatus: Consualtation.apptStatus
            }
            scope.SetPage = function() {
                scope.searchObjectMap.Offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.Limit;
                scope.load();
            };
            scope.load = function() {
                o.loadingPage(true);
                scope.searchObjectMapTemp = angular.copy(scope.searchObjectMap);
                consultationServices.listConsultation(scope.searchObjectMapTemp).then(function(response) {
                    o.loadingPage(false);
                    console.log("response",response)
                    scope.consultation = response.rows;
                    scope.CountRow = response.count;
                },function(err){
                    o.loadingPage(false);
                    toastr.error('fail');
                });
            }
            Init();
            scope.toggle = true;
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };
        }
    };
})