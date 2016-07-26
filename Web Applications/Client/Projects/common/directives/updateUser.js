angular.module('app.common.updateUser',[])
.directive('updateUser',function(CommonService, PatientService, $rootScope, $cookies, toastr, $uibModal){
	return {
		restrict: 'EA',
		scope: {
			userUID:"=userUid",
			finish:"&onFinish",
		},
		controller: function($scope) {
		},
		link:function(scope,element,attrs) {
			scope.openModal = function(uid, whenFinish) {
				if(uid != null && uid != '') {
					var modalInstance = $uibModal.open({
						templateUrl: 'EditUser',
						controller: function($scope){
							$scope.user = {
								UID : uid
							};

							$scope.getUserData = function() {
								CommonService.getUserProfile({UID: uid})
								.then(function(response) {
									$scope.user = response;
								}, function(err) {
									console.log("err ",err);
								})
							}

							$scope.close = function() {
								modalInstance.close();
							};

							$scope.generatePassword = function() {
								var newPass = generatePassword(6, false, /^[A-Za-z0-9]$/);
								$scope.user.Password = newPass;
							}

							function sendmail(userInfo) {
								var p = new Promise(function(a, b) {
									if(userInfo.Email) {
										CommonService.sendMail({userInfo:userInfo,template:'UpdateUser'})
										.then(function(response) {
											a(response);
										}, function(err) {
											b(err);
										})
									}
									else {
										toastr.error('Not found Email to send.');
										b(null);
									}
								});
								return p;
							}

							$scope.Submit = function(type) {
								CommonService.updateUserProfile({
									data:$scope.user, 
									type: type != null && type != '' ? type : 'default'
								})
								.then(function(response) {
									console.log("res ",response);
									var arr_promise = [];
									if(type == 'SendMail') {
										arr_promise.push(sendmail($scope.user));
									}
									return Promise.all(arr_promise);
								}, function(err) {
									throw err;
								})
								.then(function(sentEmail) {
									console.log("sendmail ",sentEmail);
									if(typeof whenFinish !== 'undefined' && typeof whenFinish === 'function') {
										whenFinish();
									}
								}, function(err) {
									console.log('err ',err);
								})
							}
							$scope.getUserData();
						},
						// windowClass: 'app-modal-window'
						size: 'lg',
					});
				}
				else {

				}
			}
		},
		templateUrl: "common/directives/updateUser.html"
	}
});