angular.module('app.authentication.eForms.directive.question9', [])
.directive('question9', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question9.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			value:'=onValue',
			isEditor:'=onEditor',
			update : '=onUpdate',
			isupdate:'=isUpdate'
		},
		controller: function($scope) {
			// App.initAjax();
		},
		link: function(scope, ele, attr) {
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			scope.idform = 'form_editor '+Math.random();
			scope.editor = scope.isEditor?scope.isEditor:false;

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);

			scope.changeValue = function(valueName) {
				if(scope.isupdate == true) {
					scope.update[valueName] = scope.info[valueName];
				}
			};
			
			
		} // end link

	} // end return

})