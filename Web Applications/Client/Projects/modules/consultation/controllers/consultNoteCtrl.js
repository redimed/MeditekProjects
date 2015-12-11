var app = angular.module("app.authentication.consultation.detail.consultNote.controller",[
]);

app.controller('consultNoteCtrl', function($scope){
	$scope.toggle = true;
	$scope.Filter = function(){
		$scope.toggle = $scope.toggle == true ? false : true;
	};
});