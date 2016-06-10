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
        // parentScope.closeWindow(fileInfo);
        parentScope.FileUploads.push(fileInfo);
        //Phan hien thi file theo tung group xac dinh
        console.log("first",angular.copy(parentScope.relevantFileUploads[window.opener.relevantGroupKey]));
        if(!parentScope.relevantFileUploads[window.opener.relevantGroupKey])
            parentScope.relevantFileUploads[window.opener.relevantGroupKey] = [];
        parentScope.relevantFileUploads[window.opener.relevantGroupKey].push(fileInfo);
        console.log("parentScope.relevantFileUploads[window.opener.relevantGroupKey]", angular.copy(parentScope.relevantFileUploads[window.opener.relevantGroupKey]));
        //Phan luu tru data push len server
        if(!parentScope.requestInfo.Consultations[0].ConsultationData[window.opener.relevantFileUploadKey]) {
            parentScope.requestInfo.Consultations[0].ConsultationData[window.opener.relevantFileUploadKey] = {
                FileUploads: [],
                Value: 0, // So luong file
            }
        }
        parentScope.requestInfo.Consultations[0].ConsultationData[window.opener.relevantFileUploadKey].FileUploads.push(fileInfo);
        parentScope.requestInfo.Consultations[0].ConsultationData[window.opener.relevantFileUploadKey].Value = parentScope.requestInfo.Consultations[0].ConsultationData[window.opener.relevantFileUploadKey].FileUploads.length;
        parentScope.$apply();
    }
});
