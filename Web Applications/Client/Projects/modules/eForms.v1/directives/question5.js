angular.module('app.authentication.eForms.directive.question5', [])
.directive('question5', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question5.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			isEditor:'=onEditor'
		},
		link: function(scope, ele, attr) {
			scope.idform = 'form_editor '+Math.random();
			scope.rbtn;
			scope.temp = [];
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;

			$timeout(function(){
				if(scope.option != null && scope.option != "") {
					angular.element(document.getElementById('form_view '+scope.option.value1))
					.append($compile(scope.option.value1)(scope));
				} 
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

})