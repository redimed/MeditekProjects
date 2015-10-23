angular.module('app.authentication.doctor.directive.create', [])
.directive('doctorCreate', function(doctorService, CommonService, $filter, toastr, $stateParams, $modal, $state, $timeout) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/create.html',
		link: function(scope, ele, attr) {

			scope.er={};
			scope.isShowNext=true;
			scope.isShowNext2=false;
			scope.isShowNext3=false;
			scope.isShowNext4=false;
			scope.isShowCreate=false;
			scope.isBlockStep1 =false;
			scope.isBlockStep2 =false;
			scope.Back = function() {
				scope.isBlockStep1 =true;
				scope.isShowNext=true;
				scope.isShowNext3=false;
				scope.isShowCreate=false;
			};

			$timeout(function () {
            	App.initComponents(); // init core components
				ComponentsSelect2.init(); // init todo page
            	ComponentsBootstrapSelect.init(); // init todo page
            	FormWizard.init(); // form step
			},0);

			scope.checkPhone = function(data) {

				scope.validateCheckPhone(data)
				.then(function(success) {

					doctorService.checksPhone(data)
					.then(function(result) {

						if(result.length > 0) {
							scope.isBlockStep1 = false;
							scope.isShowNext = false;
							scope.isBlockStep2 =false;
							scope.isShowNext3=false;
							toastr.error('MobilePhone already exists');	
						} else {
							scope.isBlockStep1 = true;
							scope.isShowNext = true;
							// scope.isBlockStep2 =false;
							// scope.isShowNext3=true;
						}
						
					}, function(err) {})
					

				}, function(err) {
					toastr.error('Information not empty');
				})

			};

			scope.checkInfos = function(data) {
				scope.validateCheckInfo(data)
				.then(function(success) {

					doctorService.checkEmail(data)
					.then(function() {

						if(result.length > 0) {
							scope.isBlockStep1 = true;
							scope.isShowNext = true;
							scope.isBlockStep2 =false;
							scope.isShowNext2 = false;
							scope.isShowNext3=false;
							toastr.error('Email already exists');	
						} else {
							scope.isBlockStep1 = true;
							scope.isShowNext = true;
							scope.isBlockStep2 =true;
							scope.isShowNext2 = true;
							scope.isShowNext3=false;
						}

					}, function(err) {})

				}, function(err) {
					toastr.error('Information not empty');
				})
			};

			scope.show = function(){
				scope.isShowNext=false;
				scope.isShowNext2=true;
			};
			scope.show2 = function(){
				scope.isShowNext2=false;
				scope.isShowNext3=true;
			};
			scope.show3 = function(){
				scope.isShowNext3=false;
				scope.isShowNext4=true;
			}
			scope.show4 = function(){
				scope.isShowNext4=false;
				scope.isShowCreate=true;
			}			

		} // end link

	} // end return

})