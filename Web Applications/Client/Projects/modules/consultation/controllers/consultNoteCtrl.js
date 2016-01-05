var app = angular.module("app.authentication.consultation.detail.consultNote.controller",[
]);

app.controller('consultNoteCtrl', function($scope){
	// alert($scope.uid)
	$scope.uid = {
		show:function(uid){
			$scope.consultationuid = uid;
		}
	}
});