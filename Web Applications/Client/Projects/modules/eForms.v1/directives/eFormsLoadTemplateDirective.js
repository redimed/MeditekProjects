angular.module('app.authentication.eForms.directive.loadtemplate', [])
.directive('loadTemplate', function(eFormService, PatientService, $uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/eFormsLoadTemplateDirective.html',
		scope:{
			loadData:'=onLoaddata',
			loadTemplate:'=onLoadtemplate'
		},
		link: function(scope, ele, attr) {
			scope.info = {};
			//var data nay sau nay se duoc truyen vao tu controller
			var data = {
				UID:"289fb0e4-1ad4-49b9-b1f8-fcd9feed4db0",
				EFormUID:"21699364-4c31-45a3-aede-759d2f324ef3",
				EFormTemplateID:30
			};
			//end

			scope.init = function() {
				eFormService.getData(data)
				.then(function(result){
					scope.info = result.data;
					 angular.element(document.getElementById('data'))
						.append($compile("<generate-directive on-data='info'></generate-directive>")(scope));
				},function(err){
					console.log(err);
				});
			};

			scope.init();

			
		} // end link

	} // end return

})