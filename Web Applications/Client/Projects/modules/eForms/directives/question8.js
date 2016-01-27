angular.module('app.authentication.eForms.directive.question8', [])
.directive('question8', function($uibModal, $state, toastr,$timeout, $compile) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question8.html',
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
			scope.currentYear = new Date().getFullYear();
			// scope.option.value1 = " ";//default value 1
			// scope.option.value2 = 1;
			scope.idform = 'form_editor '+Math.random();
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			scope.listItem = [
				{id:1,name:"text"},
				{id:2,name:"date"},
				{id:3,name:"checkbox"},
				{id:4,name:"radio"},
				{id:5,name:"textarea"}
			];
			// scope.data = scope.info;

			scope.changeValue = function(id) {
				if(scope.isupdate == true) {
					scope.update['value'+id] = scope.info['value'+id];
				}
			};

			$timeout(function(){
				console.log(scope.option);
				var id ='form_view '+scope.option.value1;
				if(scope.option.value2 > 0){
					switch(scope.option.value2) {
						case "1":
					        angular.element(document.getElementById(id))
							.append($compile("<div class='col-md-12'><div class='col-md-3'>{{option.value1}}</div>"+
									"<div class='col-md-5'><input type='text' ng-model='info.value1' ng-change='changeValue(1)' class='form-control' /></div></div>")(scope));
					        break;
					    case "2":
					        angular.element(document.getElementById(id))
							.append($compile("<div class='col-md-12'><div class='col-md-3'>{{option.value1}}</div>"+
									"<div class='col-md-5'><input type='text' ng-model='info.value1' "+
									"class='form-control form-control-inline date-picker' size='16' type='text' "+
									"data-date-format='dd/mm/yyyy' date-start-date='1/1/1900' data-date-end-date='0d' id='date' ng-change='changeValue(1)' readonly='true' /></div></div>")(scope));
					        break;
					    case "3":
					        angular.element(document.getElementById(id))
							.append($compile("<div class='col-md-12'><div class='col-md-3'>{{option.value1}}</div>"+
									"<div class='col-md-5'><input type='checkbox' ng-model='info.value1' "+
									" ng-change='changeValue(1)' ng-true-value='0' ng-false-value='1' /></div></div>")(scope));
					        break;
					    case "4":
					        angular.element(document.getElementById(id))
							.append($compile("<div class='col-md-12'><div class='col-md-3'>{{option.value1}}</div>"+
									"<div class='col-md-5'><input type='radio' name='"+scope.option.value1+
									"' ng-model='info.value1' ng-change='changeValue(1)' ng-value='1' /></div></div>")(scope));
					        break;
					    case "5":
					        angular.element(document.getElementById(id))
							.append($compile("<div class='col-md-12'><div class='col-md-3'>{{option.value1}}</div>"+
									"<div class='col-md-9'><textarea class='form-control' ng-model='info.value1' ng-change='changeValue(1)' row='7' /></div></div>")(scope));
					        break;		    
						default:
					        alert("Error");
					}
				}
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);
			
			

		} // end link

	} // end return

})