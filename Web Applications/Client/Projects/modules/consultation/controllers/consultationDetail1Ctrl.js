var app = angular.module("app.authentication.consultation.detail1.controller", [
]);
app.controller('consultationDetail1Ctrl', function($scope, $state) {
	$state.go("authentication.consultation.detail1.workCover");
	$scope.toggle = true;
	$scope.zoomLabel = 'Show Profile';
	$("#col2").hide();
	$scope.zoom = function(){
		$scope.toggle = !$scope.toggle;
		if($scope.toggle == true) {
			$scope.zoomLabel = 'Show Profile';
			$("#col1").removeClass("col-lg-9 col-md-8 col-sm-8 col-xs-8");
			$("#col1").addClass("col-xs-12");
			$("#col2").hide();
		} else {
			$scope.zoomLabel = 'Hide Profile';
			$("#col1").removeClass("col-xs-12");
			$("#col1").addClass("col-lg-9 col-md-8 col-sm-8 col-xs-8");
			$("#col2").show();
		}
	};
});
  