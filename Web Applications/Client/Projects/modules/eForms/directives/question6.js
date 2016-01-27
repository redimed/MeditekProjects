angular.module('app.authentication.eForms.directive.question6', [])
.directive('question6', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question6.html',
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
			// ComponentsDateTimePickers.init();
		},
		link: function(scope, ele, attr) {
			scope.currentYear = new Date().getFullYear();
			scope.option.value1 = " ";
			scope.idform = 'form_editor '+Math.random();
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;
			console.log(scope.info);

			scope.changeValue = function(valueName) {
				if(scope.isupdate == true) {
					scope.update[valueName] = scope.info[valueName];
				}
			};

			if(scope.info != null && scope.info != "" && scope.info != undefined && _.isEmpty(scope.info) == false)
				scope.info.Age = parseInt(scope.currentYear - scope.info.DOB.substr(scope.info.DOB.length - 4));

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);
			
			

		} // end link

	} // end return

})