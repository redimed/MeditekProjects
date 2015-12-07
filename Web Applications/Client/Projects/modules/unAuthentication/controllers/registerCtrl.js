var app = angular.module('app.unAuthentication.register.controller', [
]);

app.controller('registerCtrl', function($scope, $state, FileUploader, toastr, $cookies, CommonService, doctorService, UnauthenticatedService){
	$scope.ermsg = {};
	// List country
	UnauthenticatedService.listCountry()
	.then(function(result) {
		$scope.country = result;
		$scope.data.CountryID = 14;
	}, function(err) {});

    // Back
    $scope.stepback_one = function() {
    	$state.go('unAuthentication.login', {
    		reload: true
    	});
    };

    $scope.checkDataNull = function(name){
		    	if($scope.data[name].length==0)
		    		$scope.data[name] = null;
		    };

	// Check User
	$scope.checkUser = function(data) {
		$scope.loadingpage = true;
		$scope.validateCheck(data)
		.then(function(success) {
			if(data.Password === data.RePassword){
				UnauthenticatedService.checkUserStep1(data)
				.then(function(result) {
					$scope.step++;
					$scope.loadingpage = false;
				},function(err){
					console.log(err);
					$scope.loadingpage = false;
					toastr.error("Please check data","Error");
					for(var i = 0; i < err.data.ErrorsList.length; i++){
						$scope.ermsg[err.data.ErrorsList[i].field] = {};
						$scope.ermsg[err.data.ErrorsList[i].field].css = {'border': '2px solid #DCA7B0'};
						$scope.ermsg[err.data.ErrorsList[i].field].msg = err.data.ErrorsList[i].message;
					}
				}); // end check
			}
			else {
				toastr.error("Password and RePassword does not match", "Error");
				$scope.loadingpage = false;
				$scope.ermsg['Password'] = {};
				$scope.ermsg['Password'].css = {'border': '2px solid #DCA7B0'};
				$scope.ermsg['Password'].msg = "does not match";
				$scope.ermsg['RePassword'] = {};
				$scope.ermsg['RePassword'].css = {'border': '2px solid #DCA7B0'};
				$scope.ermsg['RePassword'].msg = "does not match";
			}
		},function(err){
			$scope.loadingpage = false;
			console.log(err);
			toastr.error("Please check data","Error");
			for(var i = 0; i < err.length; i++) {
				$scope.ermsg[err[i].field] = {};
				$scope.ermsg[err[i].field].css = {'border': '2px solid #DCA7B0'};
				$scope.ermsg[err[i].field].msg = err[i].message;
			}
		});
			
	}

    // Check Info
    $scope.save = function(data) {

        $scope.validateInfo(data)
        .then(function(success) {
            
            data.CreatedDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
            data.Type = 'EXTERTAL_PRACTITIONER';

            UnauthenticatedService.createAccount(data)
            .then(function(result) {
                var info = {
                    PhoneNumber: data.PhoneNumber,
                    // PhoneNumber: '+840936767117',
                    content: CommonService.contentVerify+ ' ' +result.data.VerificationCode
                };
                UnauthenticatedService.sendSms(info)
                .then(function(success) {
                    toastr.success('Register Successfull');
                    $state.go('unAuthentication.login', null, {
                        location: 'replace',
                        reload: true
                    });
                }, function(err) {
                	console.log(err);
                });
                        
            }, function(err) {
            	console.log(err);
            	toastr.error("Please check data","Error");
				for(var i = 0; i < err.data.ErrorsList.length; i++){
					$scope.ermsg[err.data.ErrorsList[i].field] = {};
					$scope.ermsg[err.data.ErrorsList[i].field].css = {'border': '2px solid #DCA7B0'};
					$scope.ermsg[err.data.ErrorsList[i].field].msg = err.data.ErrorsList[i].message;
					if(err.data.ErrorsList[i].field=="captcha"){
						$('iframe').css("border","2px solid #DCA7B0");
					}
				}
            });
        }, function(err) {
        	toastr.error("Please check data!","Error");
        	console.log(err);
        	for(var i = 0; i < err.length; i++) {
				$scope.ermsg[err[i].field] = {};
				$scope.ermsg[err[i].field].css = {'border': '2px solid #DCA7B0'};
				$scope.ermsg[err[i].field].msg = err[i].message;
				if(err[i].field=="captcha"){
					$('iframe').css("border","2px solid #DCA7B0");
				}
			}
        });

    }

	// Back Button
	$scope.btn_back = function(){
		// $scope.show_hide =s true;
		$scope.step--;
	}
	
	$scope.step = 1;

});