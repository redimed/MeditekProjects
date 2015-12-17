var app = angular.module('app.unAuthentication.changepass.controller', []);
app.controller('changepassCtrl', function($scope,$rootScope, $q, $state, $cookies, UnauthenticatedService, toastr, $timeout) {
	$scope.data = {};
	$scope.err  = {};
	$scope.isCheck= false;
	var data = {
		token:$state.params.token,
		UID: $state.params.uid
	};

	UnauthenticatedService.ConfirmToken(data)
	.then(function(success){
		console.log(success);
		$scope.isCheck = true;
	},function(err){
		toastr.error(err.data.ErrorsList[0],"Error");
		console.log(err);
	});

	$scope.changePass = function() {
		return $scope.validate($scope.data)
		.then(function(success){
			if($scope.data.newpass == $scope.data.verifypass){
				var changedata = {
					newpass : $scope.data.newpass,
					UID     : $state.params.uid
				};
				UnauthenticatedService.changePass(changedata)
				.then(function(success){
					toastr.success("Change Successfully","success");
					$state.go("unAuthentication.login");
					console.log(success);
				},function(err){
					console.log(err);
				});
			}
			else {
				toastr.error("Password and RePassword does not match");
				$scope.err.newpass = {};
				$scope.err.verifypass = {};
				$scope.err.newpass.css = {'border':'2px solid #DCA7B0'};
				$scope.err.newpass.msg = "does not match";
				$scope.err.verifypass.css = {'border':'2px solid #DCA7B0'};
				$scope.err.verifypass.msg = "does not match";
			}
		},function(err){
			console.log(err);
			toastr.error("Please check data","Error");
			for(var i = 0; i < err.length; i++) {
				$scope.err[err[i].field] = {};
				$scope.err[err[i].field].css = {'border':'2px solid #DCA7B0'};
				$scope.err[err[i].field].msg = err[i].message;
			}
		});

	};

	$scope.validate = function(info) {
		var error = [];
		var passPattern = /^[a-z0-9]{6,12}$/;
		var q = $q.defer();
		try {
			//validate newpass
			if(info.newpass){
				if(!passPattern.test(info.newpass)){
					error.push({field:"newpass",message:"invalid New Password"});
				}
			}
			else{
				error.push({field:"newpass",message:"required"});
			}

			//validate verifypass
			if(info.verifypass){
				if(!passPattern.test(info.verifypass)){
					error.push({field:"verifypass",message:"invalid New Password"});
				}
			}
			else{
				error.push({field:"verifypass",message:"required"});
			}

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	}

	$scope.checkDataNull = function(name) {
		if($scope.data[name].length==0)
			$scope.data[name] = null;
	}
});