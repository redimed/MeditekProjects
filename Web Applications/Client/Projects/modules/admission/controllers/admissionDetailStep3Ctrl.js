var app = angular.module('app.authentication.admission.detail.step3.controller',[]);

app.controller('admissionDetailStep3Ctrl', function($scope){
	angular.element(".progress-bar").attr("style","width:100%");
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid){
			alert('Thanh công');
		}
	};
});