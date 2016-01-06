var app = angular.module('app.authentication.admission.request.step3.controller',[]);

app.controller('admissionRequestStep3Ctrl', function($scope, $timeout){
	$timeout(function(){
        App.initAjax();
    },0);
	angular.element(".progress-bar").attr("style","width:100%");
	$scope.submit = function(){
		$scope.submitted = true;
		if($scope.form.$valid){
			alert('Thanh công');
		}
	};
});