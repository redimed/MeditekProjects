angular.module('app.authentication.eForms.directive.generate', [])
.directive('generateDirective', function(eFormService, PatientService, $uibModal, $state, toastr,$timeout, $compile, $injector) {

	return {

		// require: 'question4',
		restrict: 'E',
		templateUrl: 'modules/eForms/directives/templates/generateDirective.html',
		scope:{
			// data:'=onData',
			templateuid  : '=onTemplateuid',//nhan template's UID duoc truyen vao tu noi goi directive
			patientuid   : '=onPatientuid',//nhan patient's UID duoc truyen vao tu noi goi directive
			apptuid      : '=onApptuid',// nhan Appointment's UID duoc truyen vao tu noi goi directive ( co the co hoac k co)
			datauid      : '=onDatauid',// nhan Eform data's UID duoc truyen vao tu noi goi directive (co the co hoac k co)
			isEditor     : '=onEditor',
			isUpdatedata : '=onUpdate',
			demo         : '&',//vi du de goi 1 func tu controller khac va truyen data xu ly o directive nay cho func o controller do
			exem         : '=onExem'//vi du de goi 1 func tu controller khac va truyen data xu ly o directive nay cho func o controller do
		},
		controller: function($scope) {
		},
		link: function(scope, ele, attrs) {
			// scope.patientuid  = "289fb0e4-1ad4-49b9-b1f8-fcd9feed4db0";//gan mac dinh
			// scope.templateuid = "225dd82f-cde9-4ccc-a320-c28d8c3008aa";//gan mac dinh
			// scope.datauid     = "b826e747-49fc-4e37-8099-9e0a68f2393c";//gan mac dinh
			if(scope.isUpdatedata == null || scope.isUpdatedata == "")
				scope.isUpdatedata = false;
			console.log(scope.isUpdatedata);
			scope.PatientDetails;
			scope.list;
			scope.info = {};
			scope.updatedata = {};
			scope.errorList = [];

			//vi du
			scope.exem = "shgush";
			// scope.demo();
			// end vi du
			if(scope.datauid != undefined && scope.datauid != null && scope.datauid != ""){
				eFormService.getData({UID:scope.datauid}).then(function(got_data){
					scope.info = got_data.data;
				},function(err){
					console.log(err);
				});
			}
			if(scope.patientuid != undefined && scope.patientuid != null && scope.patientuid != "") {
				PatientService.detailPatient({UID:scope.patientuid}).then(function(result){
					if(result != null && result != "" && result.length != 0){
						scope.PatientDetails = result.data[0];
					}
				},function(err){
					console.log(err);
				});
			}

			//function count property in obj
			scope.countProperty = function(obj) {
				var count = 0;
				for(var key in obj){
					if(obj.hasOwnProperty(key)==true)
						count++;
				}
				return count;
			};
			//end function

			//function get property name
			scope.getPropertyName = function(obj) {
				var array = [];
				for(var key in obj) {
					if(obj.hasOwnProperty(key)==true)
						array.push(key);
				}
				return array;
			};
			//end function

			scope.createSection = function(id, elem) {
				elem.append($compile("<div class='row' name='"+id+"'><div class='col-md-12 col-sm-12'>"
                        +"<div class='portlet light bordered'><div class='portlet-title'>"
                        +"<div class='caption font-blue'><i class='glyphicon glyphicon-list font-blue'></i>"
                        +"<span class='caption-subject bold uppercase'>"+id+"</span>"
                        +"<span class='caption-helper'>"+id+"</span></div>"
                        +"<div class='tools'><a href='javascript:;' class='collapse'> </a>"
                        +"<a href='javascript:;' class='fullscreen'> </a></div>"
                        +"</div><div class='portlet-body form'><div class='form-body'><div class='row'>"
                        +"<div class='col-md-8 col-sm-8 col-md-offset-2 col-sm-offset-2' id='"+id+"'></div></div></div></div></div></div></div>")(scope));
			};

			//function generate div section
			scope.generateDiv = function(id, elem) {
				elem.append($compile("<div class='row' id='"+id+"'></div>")(scope));
			};

			//function choose directive question
			scope.ChooseQuestion = function(idQuestion, idElem, modelValue, updateValue, detailName, QuestionName, dataDetailName) {
				if(dataDetailName.value1 == "" || dataDetailName.value1 === "NoTitle" || !('value1' in dataDetailName)){
					dataDetailName.value1 ="NoTitle " + Math.random();
		    	}
				switch(idQuestion) {
				  //   case 1:
				  //       angular.element(document.getElementById(idElem))
						// .append($compile("<demo-directive on-data='"+modelValue+"' on-label='"+detailName+"' isEditor='false'></demo-directive>")(scope));
				  //       break;
				    case 1:
				        angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question1 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"'  on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 2:
				        angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question2 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"'  on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 3:
				        angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question3 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"'  on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 4:
				         angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question4 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"'  on-editor='false' is-update='true' on-validate='errorList' ></div>")(scope));
				        break;
				    case 5:
				        angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question5 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"'  on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 6:
				    	 angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question6 on-data='"+modelValue+"' on-option='"+detailName+
							"' on-value='PatientDetails' on-update='"+updateValue+"' is-update='true' on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 7:
				    	 angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question7 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"' on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 8:
				    	angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question8 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"' on-editor='false' is-update='true' ></div>")(scope));
				        break;
				    case 9:
				    	angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question9 on-data='"+modelValue+"' on-option='"+detailName+"' on-update='"+updateValue+
							"' is-update='true' is-update='true' on-editor='false' ></div>")(scope));
				        break;
				    case 10:
				    	angular.element(document.getElementById(idElem))
						.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idElem+"."+QuestionName
							+"' ><question10 on-data='"+modelValue+"' on-option='"+detailName+"' is-update='true' on-update='"+updateValue+
							"' on-editor='false' ></div>")(scope));
				        break;
				    default:
				        alert("abc");
				}
			};
			//end function

			scope.submit = function() {
				var postData = {};
				postData.EFormUID = scope.EFormUID;
				postData.PatientDetails = scope.PatientDetails;
				postData.Name = scope.Name;
				postData.data = scope.info;
				console.log(postData);
				//scope.$broadcast('validate');
				//console.log(scope.errorList);
				 eFormService.insertData(postData)
				 .then(function(success){
				 	console.log(success);
				 },function(err){
				 	console.log(err);
				 });
				 console.log(scope.updatedata);
			};

			scope.update = function() {
				console.log(scope.updatedata);
				var postData = {};
				postData.info = scope.updatedata;
				postData.uid  = scope.datauid;
				eFormService.updateData(postData)
				.then(function(success){
					console.log(success);
				},function(err){
					console.log(err);
				});
			};

			scope.init = function() {
				return eFormService.getTemplate({UID:scope.templateuid})
				.then(function(result){
					scope.EFormUID = result.data.EFormUID;
					scope.Name = result.data.Name;
					console.log(scope.Name);
					scope.list = result.data.ListQuestion;
					scope.detail = result.data.DetailTemplate;
					var SectionName = [];
					var elem = angular.element(document.getElementById('form'));
					for(var i = 0; i < scope.list.length; i++) {
						var temp = SectionName.filter(function(attr){
							return attr.Section == scope.list[i].SectionName;
						});
						if(temp.length == 0) {
							SectionName.push({Section:scope.list[i].SectionName});
						}
					}
					for(var i = 0; i < SectionName.length; i++) {
						if(scope.datauid == null)
							scope.info[SectionName[i].Section] = {};
							scope.updatedata[SectionName[i].Section] = {};
						scope.createSection(SectionName[i].Section,elem);
						var QuestionName = scope.list.filter(function(attr){
							return attr.SectionName == SectionName[i].Section;
						});
						var sectionDiv = angular.element(document.getElementById(SectionName[i].Section));
						for(var j = 0; j < QuestionName.length; j++) {
							scope.generateDiv(QuestionName[j].Name,sectionDiv);
							var aa = scope.list.filter(function(attr){
								return attr.SectionName == SectionName[i].Section && attr.Name == QuestionName[j].Name;
							});
							var modelName  = "info."+SectionName[i].Section+"."+QuestionName[j].Name;
							var updateName = "updatedata."+SectionName[i].Section+"."+QuestionName[j].Name;
							scope.updatedata[SectionName[i].Section][QuestionName[j].Name] = {};
							if(scope.datauid == null){
								scope.info[SectionName[i].Section][QuestionName[j].Name] = {};
								if(aa[0].QuestionTypeID == 6) {
									scope.info[SectionName[i].Section][QuestionName[j].Name] = scope.PatientDetails;
								}
							}
							var detailName = "detail."+SectionName[i].Section+"."+QuestionName[j].Name;
							var dataDetailName = scope.detail[SectionName[i].Section][QuestionName[j].Name];
							scope.ChooseQuestion(aa[0].QuestionTypeID,aa[0].Name,modelName, updateName, detailName, QuestionName[j].Name, dataDetailName);
						}
					}
				},function(err){
					console.log(err);
				});
			}

			scope.stringCut = function(string,begin,end) {
				return string.substr(begin,end);
			};

			scope.addProperty = function(array, objectmerge, flag) {
				while(1) {
					if(array.length > 0){
						if(objectmerge.hasOwnProperty(array[0])==true){
							var key = array[0];
							flag = array[0];
							array.splice(0,1);
							scope.addProperty(array,objectmerge[key], flag);
						}
						else{
							objectmerge[array[0]] = {};
							flag = array[0];
							array.splice(0,1);
							scope.addProperty(array,objectmerge[flag], flag);
						}	
					}
					else {
						break;
					}
				}
				return objectmerge;
			};

			var t0 = performance.now();
			scope.init();
			var t1 = performance.now();
			console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");


			
		} // end link

	} // end return

})