angular.module('app.authentication.eForms.directive.question2', [])
.directive('question2', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question2.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			question:'=onQuestion',
			isEditor:'=onEditor'
		},
		link: function(scope, ele, attr) {
			scope.temp = [];
			scope.idform = 'form_editor '+Math.random();
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;
			
			$timeout(function(){   
				if(scope.option != null && scope.option != "") {
					if(scope.option.value1 == "0" || scope.option.value1 == 0){
						angular.element(document.getElementById('form_view '+scope.option.value1))
								.append($compile("<div class='col-md-12'>"+
									"<div class='col-md-1'><label>Name : </label></div>"+
									"<div class='col-md-2'><input type='text' ng-model='info.Name' /></div>"+
									"<div class='col-md-1'><label>Signature : </label></div>"+
									"<div class='col-md-2'><input type='text' ng-model='info.Signature' /></div>"+
									"<div class='col-md-1'><label>Date : </label></div>"+
									"<div class='col-md-2'><input type='text' ng-model='info.Date' /></div>"+
									"</div>")(scope));
					}
					else {
						angular.element(document.getElementById('form_view '+scope.option.value1))
								.append($compile("<div class='col-md-12'>"+
									"<div class='col-md-1'><label>Signature : </label></div>"+
									"<div class='col-md-2'><input type='text' ng-model='info.Signature' /></div>"+
									"<div class='col-md-1'><label>Date : </label></div>"+
									"<div class='col-md-2'><input type='text' ng-model='info.Date' /></div>"+
									"</div>")(scope));
					}
				}
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

})