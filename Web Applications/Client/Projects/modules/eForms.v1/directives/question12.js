angular.module('app.authentication.eForms.directive.question12', [])
.directive('question12', function(PatientService, $uibModal, $state, toastr,$timeout, $compile, $cookies) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question12.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			value:'=onValue',
			isEditor:'=onEditor'
		},
		controller: function($scope) {
		},
		link: function(scope, ele, attr) {
			console.log(scope.nameValue);
			scope.userInfo = $cookies.getObject('userInfo');
			scope.idform = 'form_editor '+Math.random();
			scope.editor = scope.isEditor?scope.isEditor:false;

			
			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);
			
			

		} // end link

	} // end return

})