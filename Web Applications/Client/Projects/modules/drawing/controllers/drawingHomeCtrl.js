var app = angular.module('app.blank.drawing.home.controller', []);

app.controller('drawingHomeCtrl', function($scope,$cookies,$stateParams,$rootScope) {
	var parentScope = window.opener.angular.element('#ctrl').scope();
	$rootScope.refreshCode = window.opener.refreshCode;
	console.log('2222',$rootScope.refreshCode);
    $scope.drawingData = {
        userUID: $cookies.getObject('userInfo').UID,
        fileType: 'MedicalDrawing'
    };

    $scope.drawingAction = function(fileInfo) {
        parentScope.closeWindow(fileInfo);
        parentScope.FileUploads.push(fileInfo);
        parentScope.$apply();
        console.log(parentScope.FileUploads);
    }
});
