angular.module('app.authentication.eForms.directive.question7', [])
.directive('question7', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question7.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			value:'=onValue',
			isEditor:'=onEditor',
			update : '=onUpdate',
			isupdate:'=isUpdate'
		},
		link: function(scope, ele, attr) {
			console.log(scope.option,scope.info);
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			scope.currentYear = new Date().getFullYear();
			scope.option.value1 = " ";
			scope.idform = 'form_editor '+Math.random();
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;

			scope.changeValue = function(valueName) {
				if(scope.isupdate == true) {
					scope.update[valueName] = scope.info[valueName];
				}
			};

			$timeout(function(){   
				
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

})