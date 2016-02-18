angular.module('app.authentication.eForms.directive.question10', [])
.directive('question10', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question10.html',
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

			scope.changeValue = function(valueName) {
				if(scope.isupdate == true) {
					scope.update[valueName] = scope.info[valueName];
				}
			};

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);
			
			

		} // end link

	} // end return

})