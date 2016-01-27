angular.module('app.authentication.eForms.directive.question4', [])
.directive('question4', function($uibModal, $state, toastr,$timeout, $compile, $injector) {

	return {

		restrict: 'E',
		templateUrl: 'modules/eForms/directives/templates/question4.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			question:'=onQuestion',
			isEditor:'=onEditor',
			edit:'=onEdit',
			update : '=onUpdate',
			isupdate:'=isUpdate',
			validates:'=onValidate'
		},
		controller: function($scope) {
		},
		link: function(scope, ele, attr) {
			console.log(scope.option);
			scope.idform = 'form_editor '+Math.random();
			if(scope.isupdate == null || scope.isupdate == "")
				scope.isupdate = false;
			scope.isHaveTitle = true;
			scope.textboxList;
			scope.temp = [];
			// scope.labelName = {};
			scope.editor = scope.isEditor?scope.isEditor:false;
			// scope.data = scope.info;

			scope.Remove = function(value) {
				console.log(value);
			};

			scope.MoveUp = function(value) {
				console.log(value);
			};

			scope.MoveDown = function(value) {
				console.log(value);
			};

			scope.generateTextbox = function(value) {
				if(value == 0 || value == null || value == "") {
					console.log("generateTextbox.error.InvalidValue");
				}
				else {
					if(scope.option.value2 == null || scope.option.value2 == ""){
						for(var i = 1; i <= value; i++){
							angular.element(document.getElementById(scope.idform))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12'>"+
								"<div class='col-md-2'><label>Question Name: </label></div>"+
								"<div class='col-md-2'><input type='text' class='form-control'  ng-model='option.value"+(i+2)+
								"' /></div><div class='col-md-2'>Regex</div><div class='col-md-2'>"+
								"<input type='text' class='form-control' ng-model='option.regex"+i+"' /></div></div>")(scope));
						}
						scope.option.value2 = value;
					}
					else {
						// var size = parseInt(scope.option.value2) + parseInt(value);
						for(var i = 1; i <= value; i++){
							console.log(scope.option.value2);
							angular.element(document.getElementById(scope.idform))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12'>"+
								"<div class='col-md-2'><label>Question Name: </label></div>"+
								"<div class='col-md-2'>"+
								"<input type='text'  ng-model='option.value"+(parseInt(i)+parseInt(scope.option.value2)+2)+
								"' /></div><div class='col-md-2'><button ng-click='Remove('"+
									(parseInt(i)+parseInt(scope.option.value2)+2)+"')'>Remove</button></div>"+
								"<div class='col-md-2'><button ng-click='MoveUp('"+
									(parseInt(i)+parseInt(scope.option.value2)+2)+"')'>MoveUp</button></div>"+
								"<div class='col-md-2'><button ng-click='MoveDown('"+
									(parseInt(i)+parseInt(scope.option.value2)+2)+"')'>MoveDown</button></div></div>")(scope));
						}
						scope.option.value2 = parseInt(scope.option.value2) + parseInt(value);
					}
				}
			};

			scope.changeValue = function(id) {
				if(scope.isupdate == true) {
					scope.update['value'+id] = scope.info['value'+id];
				}
			};

			scope.$on('validate', function () {
			     console.log('function run');
			     scope.validation();
			});

			scope.validation = function() {
				for(var i = 1; i <= scope.option.value2; i++) {
					var RegexPattern = 'regex'   + i;
					var position     = 'value'   + i;
					var message      = 'message' + i;
					var newPattern = new RegExp(scope.option[RegexPattern]);
					var item = _.find(scope.validates, function(obj) { 
						return obj.message == scope.option[message] && obj.Name == position 
					});
					if(_.isEmpty(item) == false) {
						scope.validates =  scope.validates.filter(function(el) {
							return el != item; 
						});
					}
					if(newPattern.test(scope.info[position])==false){
						scope.validates.push({message:scope.option[message],Name:position});
					}
				}
			};
			

			$timeout(function(){
				if(scope.editor == false){
					if(scope.option != null && scope.option != "") {
						if('value1' in scope.option){
							var string = scope.option.value1.substring(0,7);
							if(string =="NoTitle")
								scope.isHaveTitle = false;
						}
						else {
							scope.isHaveTitle = false;
						}
						for(var i = 1; i <= scope.option.value2; i++){
								scope.info["value"+i] = "";
								angular.element(document.getElementById('form_view '+scope.option.value1))
								.append($compile("<div class='col-md-4 col-sm-4'><div class='form-group'>"+
					    			"<label class='control-label'>{{option.value"+(i+2)+"}}</label>"+
					    			"<input type='text' ng-change='changeValue("+i+")' ng-model='info.value"+i+"' class='form-control'></div></div>")(scope));
									
							}
					} 
				}
				else {
					if(scope.option != null && scope.option != "") {
						for(var i = 1; i <=scope.option.value2; i++) {
							angular.element(document.getElementById(scope.idform))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12'>"+
								"<div class='col-md-2'><label>Question Name: </label></div>"+
								"<div class='col-md-2'>"+
								"<input type='text'  ng-model='option.value"+(i+2)+
								"' /></div><div class='col-md-2'><button ng-click='Remove("+(i+2)+")'>Remove</button></div>"+
								"<div class='col-md-2'><button ng-click='MoveUp("+(i+2)+")'>MoveUp</button></div>"+
								"<div class='col-md-2'><button ng-click='MoveDown("+(i+2)+")'>MoveDown</button></div></div>")(scope));
							}
					}
				}
				App.initAjax();
			},0);
			
			

		} // end link

	} // end return

})


// {
// 	printtype:"itext, jasper",
// 	data:[{},{}]
// }