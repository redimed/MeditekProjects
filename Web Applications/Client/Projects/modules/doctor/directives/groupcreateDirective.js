angular.module('app.authentication.doctor.directive.group.create', [])
.directive('doctorGroupCreate', function(doctorService, CommonService, $rootScope, $cookies, toastr, $uibModal, $timeout, $state, $q) {

	return {
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/groupcrate.html',
		scope: {
			data:'=onData',
			showTitle:'=onType',
			success:'=onSuccess',
			cancel:'=onCancel',
		},
		link: function(scope, ele, attrs) {
			scope.showTitle = scope.showTitle?scope.showTitle:'create';
			console.log("data ",scope.data);
			scope.info = {};
			if(!_.isEmpty(scope.data)) {
				scope.info = angular.copy(scope.data);
			}
			// scope.info = scope.info?scope.info:{};
			console.log("info ",scope.info);
			scope.er = {};
			function validation(data) {
				var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
				var textRegex = /^[a-zA-Z0-9\s]*$/;

				var error = [];
				var q = $q.defer();
				try {

					//validate FirstName
					if(data.GroupName){
						if(data.GroupName.length < 0 || data.GroupName.length > 50){
							error.push({field:"GroupName",message:"max length"});
						}
						if(!characterRegex.test(data.GroupName)){
							error.push({field:"GroupName",message:"invalid value"});
						}
					}
					// else{
					// 	error.push({field:"GroupName",message:"required"});
					// }

					if(data.GroupCode) {
						if(!characterRegex.test(data.GroupCode)){
							error.push({field:"GroupCode",message:"invalid value"});
						}
					}
					else{
						error.push({field:"GroupCode",message:"required"});
					}

					if(data.Description){
						if(!textRegex.test(data.Description)){
							error.push({field:"Description",message:"invalid value"});
						}
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

			};

			scope.create = function() {
				validation(scope.info)
				.then(function(result) {
					console.log(result);
					if(result.status == "success") {
						doctorService.createGroup(scope.info)
						.then(function(response) {
							if(response) {
								scope.success();
							}
						},function(err) {
							console.log(err);
							var error = err.data.ErrorsList;
							for(var i = 0; i < error.length; i++) {
								scope.er[error[i].field] = {};
								scope.er[error[i].field].style = {"border" : "2px solid #DCA7B0"};
								scope.er[error[i].field].message = error[i].message;
							}
						});
					}
				},function(err) {
					console.log(err);
					toastr.error("Please check data.");
					for(var i = 0; i < err.length; i++) {
						scope.er[err[i].field] = {};
						scope.er[err[i].field].style = {"border" : "2px solid #DCA7B0"};
						scope.er[err[i].field].message = err[i].message;
					}
				});
			};

			scope.update = function() {
				validation(scope.info)
				.then(function(result) {
					console.log(result);
					if(result.status == "success") {
						doctorService.updateGroup(scope.info)
						.then(function(response) {
							if(response) {
								scope.success();
							}
						},function(err) {
							console.log(err);
							var error = err.data.ErrorsList;
							for(var i = 0; i < error.length; i++) {
								scope.er[error[i].field] = {};
								scope.er[error[i].field].style = {"border" : "2px solid #DCA7B0"};
								scope.er[error[i].field].message = error[i].message;
							}
						});
					}
				},function(err) {
					console.log(err);
					toastr.error("Please check data.");
					for(var i = 0; i < err.length; i++) {
						scope.er[err[i].field] = {};
						scope.er[err[i].field].style = {"border" : "2px solid #DCA7B0"};
						scope.er[err[i].field].message = err[i].message;
					}
				});
			};

		}

	}

});
