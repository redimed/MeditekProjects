angular.module('app.authentication.eForms.directive.question3', [])
.directive('question3', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question3.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			isEditor:'=onEditor',
			update : '=onUpdate',
			isupdate:'=isUpdate'
		},
		link: function(scope, ele, attr) {
			scope.idform = 'form_editor '+Math.random();
			scope.rbtn;
			scope.id = "yes_no "+Math.random();
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			scope.temp = [];
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;
			
			scope.listChose = [
				{id:1, name:"Yes/No"},
				{id:2, name:"True/False"}
			];

			scope.changeValue = function(value) {
				if(scope.isupdate == true) {
					scope.update[value] = scope.info[value];
				}
			};

			$timeout(function(){   
				
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

});