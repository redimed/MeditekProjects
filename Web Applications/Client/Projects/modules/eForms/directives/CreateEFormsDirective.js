angular.module('app.authentication.eForms.directive.createtemplate', [])
.directive('createTemplate', function(eFormService, PatientService, $uibModal, $state, toastr,$timeout, $compile, $rootScope) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/CreateEFormsDirective.html',
		scope:{
			TemplateUID:'=onTemplate',
		},
		link: function(scope, ele, attr) {
			scope.info = {};
			scope.isShowForm = false;
			scope.list = [];
			scope.a = [];
			scope.listDirective = [
				{id:1,name:"RadioBtn"},
				{id:2,name:"Signature"},
				{id:3,name:"Yes/No"},
				{id:4,name:"Textbox List"},
				{id:5,name:"Label"},
				{id:6,name:"Patient’s Details"},
				{id:7,name:"Employer’s Details"},
				{id:8,name:"Medical Assessment"},
				{id:9,name:"2 checkbox + 1 comment textbox"},
				{id:10,name:"1 checkbox + 1 comment textbox"},
				{id:11,name:"1 picture + 2 comment textbox + score + rating"},
				{id:12,name:"1 textbox + 2 checkbox choose"}
			];

			for(var i = 0; i < scope.listDirective.length; i++) {
				angular.element(document.getElementById('listNormalQuestion'))
				.append($compile("<a href='javascript:;'' class='list-group-item list-group-item-info' ng-click='addQuestionType("+
					scope.listDirective[i].id+")' >"+scope.listDirective[i].name+
                                	"<span class='badge badge-warning'> + </span></a>")(scope));
				
			}

			scope.addQuestionType = function(value) {
				if(scope.ObjectMap.QuestionType != null) {
					if(scope.ObjectMap.QuestionType == value) {
						scope.ObjectMap.QuestionType = null;
					}
					else {
						scope.ObjectMap.QuestionType = value;
					}
				}
				else{
					scope.ObjectMap.QuestionType = value;
				}
			};

			scope.ChooseQuestionToGenerate = function(idDirective, idSection, modelValue, questionName) {
					scope.questionName = idSection+"."+questionName;
					switch(idDirective) {
					   case 1:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question1 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 2:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question2 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 3:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question3 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 4:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question4 on-option='"+modelValue+"' on-editor='true' on-edit='true'></div>")(scope));
					        break;
					    case 5:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question5 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 6:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question6 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 7:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question7 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 8:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question8 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 9:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question9 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 10:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question10 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    case 11:
					    	scope.vari = {};
					    	scope.vari.section  = idSection;
					    	scope.vari.question = questionName;
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question11 on-option='"+modelValue+"' on-getname='vari' on-editor='true' on-questionimg='ObjectMap.listimg' ></div>")(scope));
					        break;
					    case 12:
					        angular.element(document.getElementById(idSection))
							.append($compile("<div class='col-md-12'>&nbsp;</div><div class='col-md-12' id='"+idSection+"."+questionName+
								"' ><question12 on-option='"+modelValue+"' on-editor='true'></div>")(scope));
					        break;
					    default:
					        alert("Error");
					}
			}

			scope.createSection = function() {
				scope.ObjectMap.section++;
				scope.isShowForm = true;
				if(scope.ObjectMap.listquestion['section'+scope.ObjectMap.section] == null || 
				scope.ObjectMap.listquestion['section'+scope.ObjectMap.section] == "")
					scope.ObjectMap.listquestion['section'+scope.ObjectMap.section] ={};
				angular.element(document.getElementById('form'))
					.append($compile("<div class='portlet light bordered'><div class='portlet-title'>"+
                               		"<div class='caption font-dark'><i class='fa fa-question font-dark'></i>"+
                                    "<span class='caption-subject bold uppercase'>"+
                                    "<input type='text' ng-model='ObjectMap.sectionNames.sectionName"+scope.ObjectMap.section+"' /></span>"+
                                    "<span class='caption-helper'>Session"+scope.ObjectMap.section+"{{ObjectMap.sectionNames.sectionName"+
                                    scope.ObjectMap.section+"}}</span></div>"+
                                	"<div class='tools'><a href='javascript:;'' class='collapse'></a></div></div>"+
                            		"<div class='portlet-body'><div class='row' id='section"+scope.ObjectMap.section+"'></div><div class='form-actions right'>"+
               						"<button class='btn btn-lg btn-primary' ng-click='CreateQuestion("+scope.ObjectMap.section+
               						",ObjectMap.QuestionType)'><i class='glyphicon glyphicon-save'></i> Add Question</button>"+
            						"</div></div>")(scope));
				// angular.element(document.getElementById('form'))
				// 		.append($compile("<div class='portlet light row' id='section"+
				// 			scope.ObjectMap.section+"'><div class='col-md-12'><button ng-click='CreateQuestion("+scope.ObjectMap.section+",ObjectMap.IDchoose)'>Them 1 loai cau hoi</button></div></div>")(scope));
			};

			//moi question duoc tao ra se mac dinh quy dinh la question + thu tu cua question do duoc tao ra (vd : question1, question2, ....)
			//thu tu cua cac question se khong bao gio giong nhau
			scope.CreateQuestion = function(section,idDirective) {
				//dau tien kiem tra sectionID truyen vao da duoc tao object trong listquestion hay chua
				//neu co thi tiep tuc bo qua buoc nay neu khong thi phai khoi tao object dua vao sectionID truyen vao
				if(idDirective == null) {
					toastr.error("Please Choose Question Type","error");
				}
				else {
					scope.ObjectMap.question++;
					var idSection = 'section'+section;
					//sau khi chon directive se duoc tra ve bien idDirective , sau nay phai xu ly lam the nao de tra ve bien nay
					// var idDirective = 1;
					var questionName = 'question'+scope.ObjectMap.question;
					if(scope.ObjectMap.listquestion[idSection][questionName] == null ||
					scope.ObjectMap.listquestion[idSection][questionName] == "")
						scope.ObjectMap.listquestion[idSection][questionName] = {};
					var filterArray = scope.ObjectMap.listTemplate.filter(function(el){
						return el.Name == questionName;
					});
					if(filterArray.length == 0)
						scope.ObjectMap.listTemplate.push({
							SectionName  : idSection,
							Name         : questionName,
							IDQuestion   : idDirective
						});
					// scope.ObjectMap.listquestion[idSection][questionName].value1 = "asdasdasd";
					//o day do chua lam nhieu cau hoi nen cho tao san~ nhu v 
					//sau nay phai chon ntn de ra duoc cau hoi
					var modelValue = 'ObjectMap.listquestion.'+idSection+'.'+questionName;
					scope.ChooseQuestionToGenerate(idDirective, idSection, modelValue, questionName);
				}
			};

			/* func submit form :
								kiem tra ten form da duoc required chua ?
								kiem tra cac section da duoc required chua ?
								kiem tra cac section da duoc them question hay chua ?
			*/
			scope.save = function() {
				if(scope.ObjectMap.DocName == null || scope.ObjectMap.DocName == "") {
					toastr.error("Required Form Name","Error");
				}
				else {
					if(scope.ObjectMap.section == 0) {
						toastr.error("Required Section","Error");
					}
					else {
						var array = [];
						for(var key in scope.ObjectMap.sectionNames) {
							array.push(scope.ObjectMap.sectionNames[key]);
						}
						if(array.length != scope.ObjectMap.section){
							toastr.error("Required Section Name","Error");
						}
						else {
							if(scope.ObjectMap.question == 0) {
								toastr.error("Required Question","Error");
							}
							else {
								console.log(scope.ObjectMap);
								eFormService.insertTemplate(scope.ObjectMap)
								.then(function(result){
									console.log(result);
								},function(err){
									console.log(err);
								});
							}
						}
					}
				}
			};

			scope.autoGeneratedTemplate = function(obj) {
				for(var key in obj.listquestion) {
					scope.createSection();
					var filterArray = obj.listTemplate.filter(function(el) {
						return el.SectionName == key;
					});
					var sizeObj = _.size(obj.listquestion[key]);
					for(var i = 0; i < sizeObj; i++) {
						scope.CreateQuestion(scope.ObjectMap.section, filterArray[i].QuestionTypeID);
					}
				}
			}

			scope.init = function() {
				if(scope.TemplateUID != null && scope.TemplateUID != "") {
					eFormService.getTemplate({UID:scope.TemplateUID})
					.then(function(result) {
						scope.ObjectMap = {
					    	DocName:"Ahihihihihihi", //null,//Ten cua document template duoc tao ra, ( bay h gan mac dinh cho no )
					        section:null,//dung de biet duoc dang o section may, co bao nhieu section,
					        QuestionType:null, // dung de biet dang chon cau hoi thu may
					        question:null,//dung de biet co bao nhieu cau hoi va dang o cau hoi nao
					        listTemplate:result.data.ListQuestion,//dung de luu template cua doc
					        listquestion:result.data.DetailTemplate,//dung de luu so luong section va trong section co bao nhieu cau hoi va trong moi cau hoi co bao nhieu label
					    };
					    scope.autoGeneratedTemplate(scope.ObjectMap);
					},function(err) {
						console.log(err);
					});						
				}
				else {
				    scope.ObjectMap = {
				    	DocName:null, //null,//Ten cua document template duoc tao ra, ( bay h gan mac dinh cho no )
				        section:0,//dung de biet duoc dang o section may, co bao nhieu section,
				        QuestionType:null, // dung de biet dang chon cau hoi thu may
				        question:0,//dung de biet co bao nhieu cau hoi va dang o cau hoi nao
				        listTemplate:[],//dung de luu template cua doc
				        listquestion:{},//dung de luu so luong section va trong section co bao nhieu cau hoi va trong moi cau hoi co bao nhieu label,
				        sectionNames:{},// luu ten cua cac section,
				        listimg:[]
				    };
				}
			};
			// var t0 = performance.now();
			scope.init();
			// var t1 = performance.now();
			// console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");

			//event when change state, disable all File image QuestionImage
			scope.$on('$stateChangeStart', 
			function(event, toState, toParams, fromState, fromParams){ 
			    // do something
			    console.log("aaaaaaaa");
			});
			//end event
			
		} // end link

	} // end return

})