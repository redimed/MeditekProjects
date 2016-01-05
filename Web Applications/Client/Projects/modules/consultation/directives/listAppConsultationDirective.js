var app = angular.module('app.authentication.consultation.directives.listAppConsultation', []);
app.directive('listappConsultation', function(consultationServices, $modal, $cookies,$state,$stateParams) {
    return {
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppConsultationDirective.html",
        link: function(scope, ele, attr) {
            scope.SetPage = function() {
                scope.searchObjectMap.Offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.Limit;
                scope.load();
            };
            scope.load = function() {
            }
            Init();
            scope.toggle = true;
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };
        }
    };
})