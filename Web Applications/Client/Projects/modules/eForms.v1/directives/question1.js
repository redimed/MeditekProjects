angular.module('app.authentication.eForms.directive.question1', [])
.directive('question1', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question1.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			isEditor:'=onEditor',
			update : '=onUpdate',
			isupdate:'=isUpdate'
		},
		link: function(scope, ele, attr) {
			scope.rbtn;
			scope.idform = 'form_editor '+Math.random();
			scope.temp = [];
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;

			scope.generateLabel = function(value) {
				if(value == 0 || value == null || value == "") {
					console.log("generateLabel.error.InvalidValue");
				}
				else {
					
					for(var i = 1; i <= value; i++){
						angular.element(document.getElementById(scope.idform))
						.append($compile("<div class='col-md-2'><input type='text'  ng-model='option.value"+(i+2)
							+"' /><input type='radio' ng-model='rbtn' ng-value='"+
							(i+1)+"' /></div>")(scope));
					}
				}
			};

			scope.changeValue = function() {
				if(scope.isupdate == true) {
					scope.update['value3'] = scope.info['value3'];
				}
			}

			$timeout(function(){
				scope.rbtnName = "random "+Math.random();
				if(scope.option != null && scope.option != "") {
					angular.element(document.getElementById('form_view '+scope.option.value1))
					.append($compile("<div class='row'><div class='col-md-12'><div class='radio-list' id='"+scope.option.value1+"'></div></div></div>")(scope));
					for(var i = 1; i <= scope.option.value2; i++){
							angular.element(document.getElementById(scope.option.value1))
							.append($compile(
								"<label class='radio-inline'>{{option.value"+(i+2)+
								"}}<input type='radio' name='{{rbtnName}}' ng-model='info.value3' ng-value='"+
								(i+1)+"' ng-change='changeValue()' /></label>")(scope));
						}
				} 
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

})