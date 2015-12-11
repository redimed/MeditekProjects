var app = angular.module('app.unAuthentication.forgot.controller',[]);

app.controller('forgotCtrl', function($scope,UnauthenticatedService, toastr){
	$scope.email;
	$scope.errors = {};
	$scope.emailError;
	$scope.checkDataNull = function() {
		if($scope.email.length==0)
			$scope.email=null;
	},
	$scope.forgotPass = function(){
		if($scope.email == null || $scope.email == "" || $scope.email == undefined){
			$scope.emailError = "Please input your email!";
			$scope.errors = {'border':'2px solid #DCA7B0'};
		}
		else {
			$scope.errors = {};
			$scope.emailError="";
			var EmailPattern=new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/);
			if(!EmailPattern.test($scope.email)){
				$scope.emailError = "invalid your email!";
				$scope.errors = {'border':'2px solid #DCA7B0'};
			}
			else {
				var data = {
					email : $scope.email
				}
				UnauthenticatedService.GetPassword(data)
				.then(function(result){
					console.log(result);
					toastr.success("send Successfuly","Successfuly");
				},function(err){
					console.log(err);
					if(err.data.ErrorsList[0]=="EmailNotExist")
						toastr.error("Email not exist","Error");
					else
						toastr.error("send error","Error");
				});
			}
		}
	}
});