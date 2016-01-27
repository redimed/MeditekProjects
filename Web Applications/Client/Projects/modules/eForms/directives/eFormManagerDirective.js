angular.module('app.authentication.eForms.directive.manager', [])
.directive('eformsManager', function(eFormService, $uibModal, $state, toastr,$timeout, $compile, $http) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/eFormManagerDirective.html',
		scope:{
			apptuid:'=onAppt'
		},
		controller: function($scope) {
			// App.initAjax();
		},
		link: function(scope, ele, attr) {
			scope.resize = "glyphicon glyphicon-resize-full";
			scope.abc ="gaga";
			console.log(scope.apptuid);
			scope.template;
			scope.listview = [];
			scope.listcreate = [];
			scope.search1;
			scope.search2;
			scope.appointmentUID;
			scope.EFormDataUID;
			scope.toggle = "block";
			scope.addClass = "col-md-8";
			scope.reSize = function(){
				scope.toggle = scope.toggle == "none" ? "block" : "none";
				angular.element("#formList").attr("style","display:"+scope.toggle);
				scope.addClass = scope.addClass == "col-md-12" ? "col-md-8" : "col-md-12";
			};

			scope.loadlistView = function(data) {
				data.UID = scope.apptuid;
				eFormService.loadlistEFormAppointment(data)
				.then(function(result){
					console.log(result.data);
					scope.listView.count = result.count;
					for(var i = 0; i < result.data.length; i++) {
						result.data[i].CreatedDate = moment(result.data[i].CreatedDate).format("DD/MM/YYYY");
					}
					scope.listview = result.data;
				},function(err) {
					console.log(err);
				});
			};

			scope.loadlistCreate = function(data) {
				data.UID = scope.apptuid;
				eFormService.loadlistTemplate(data)
				.then(function(result){
					console.log(result.data);
					for(var i = 0; i < result.data.rows.length; i++) {
						result.data.rows[i].CreatedDate = moment(result.data.rows[i].CreatedDate).format("DD/MM/YYYY");
					}
					scope.listCreate.count = result.data.count;
					scope.listcreate = result.data.rows;
				},function(err) {
					console.log(err);
				});
			};

			scope.setPage = function(id) {
				if(id == 1){
	            	scope.listView.offset = (scope.listView.currentPage - 1) * scope.listView.limit;
	            	scope.loadlistView(scope.listView);
	        	}
	        	else if(id == 2) {
	        		scope.listCreate.offset = (scope.listCreate.currentPage - 1) * scope.listCreate.limit;
	            	scope.loadlistCreate(scope.listCreate);
	        	}
	        };

	        scope.search = function(keySearch, data, e, id){
				if(e==13){
					if(keySearch == 'CreatedDate') {
						data = moment(data, 'DD/MM/YYYY HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
					}
					if(id == 1){
						scope.listView.search[keySearch] = data;
						scope.loadlistView(scope.listView);
					}
					else if(id == 2) {
						scope.listCreate.search[keySearch] = data;
						scope.loadlistCreate(scope.listCreate);
					}
				}
			};

			scope.RemoveData = function(id) {
				if(id == 1){
					if(scope.listView.search.CreatedDate != undefined && 
					scope.listView.search.CreatedDate != null && 
					scope.listView.search.CreatedDate != "") {
						scope.search1.CreatedDate = null;
						delete scope.listView.search['CreatedDate'];
						scope.loadlistView(scope.listView);
					}
				}
				else {
					if(scope.listCreate.search.CreatedDate != undefined && 
					scope.listCreate.search.CreatedDate != null && 
					scope.listCreate.search.CreatedDate != "") {
						scope.search2.CreatedDate = null;
						delete scope.listCreate.search['CreatedDate'];
						scope.loadlistCreate(scope.listCreate);
					}
				}
			};

			scope.viewEForm = function(appointmentUID, TemplateID, EFormDataUID) {
				console.log("appointmentUID ",appointmentUID," scope.appointmentUID ",scope.appointmentUID);
				console.log("EFormDataUID ",EFormDataUID," scope.EFormDataUID ",scope.EFormDataUID);
				if((scope.appointmentUID != undefined && scope.appointmentUID != null && scope.appointmentUID != "") &&
					(scope.EFormDataUID != undefined && scope.EFormDataUID != null && scope.EFormDataUID != "")) {
					if(scope.EFormDataUID != EFormDataUID) {
						scope.appointmentUID = appointmentUID;
						scope.EFormDataUID = EFormDataUID;
						$('#formView').html('');
						eFormService.getUIDTemplate({EFormTemplateID:TemplateID})
						.then(function(result){
							console.log(result);
							if(result.data != undefined && result.data != null && result.data.length != 0){
								scope.TemplateUID = result.data[0].UID;
								angular.element(document.getElementById('formView'))
								.append($compile("<generate-directive on-templateuid='TemplateUID' on-apptuid='appointmentUID' "+
												 " on-datauid='EFormDataUID' on-update='true' ></generate-directive>")(scope));
							}
							else {
								toastr.error("Fail","Error");
							}
						},function(err){
							console.log(err);
						})
					}
				}
				else {
					scope.appointmentUID = appointmentUID;
					scope.EFormDataUID = EFormDataUID;
					eFormService.getUIDTemplate({EFormTemplateID:TemplateID})
					.then(function(result){
						console.log(result);
						if(result.data != undefined && result.data != null && result.data.length != 0){
							scope.TemplateUID = result.data[0].UID;
							angular.element(document.getElementById('formView'))
							.append($compile("<generate-directive on-templateuid='TemplateUID' on-apptuid='appointmentUID' "+
											 " on-datauid='EFormDataUID' on-update='true' ></generate-directive>")(scope));
						}
						else {
							toastr.error("Fail","Error");
						}
					},function(err){
						console.log(err);
					})
				}
			};

			scope.aaaaa =function() {
				$http({
					method: 'POST',
					url: 'http://192.168.1.98:8080/itextprint',
					data: [{name:"asdasd", value:"whatthehel"}],
					'Content-Type': 'application/json',
					responseType:'arraybuffer',
				}).then(function successCallback(response) {
					console.log("success");
					console.log(response);
					var blob = new Blob([response.data],{
						type: 'application/pdf'
					});
					console.log(blob);
					saveAs(blob,"hahahaha");
				  }, function errorCallback(response) {
				  	console.log(response);
				  });
			};

			scope.cleanBody = function(id,fn) {
				$(id).html('');
				fn();
			};

			scope.createEForm = function(TemplateUID) {
				if($('#formView').children().length > 0){
					if(scope.template != TemplateUID){
						scope.template = TemplateUID;
						scope.cleanBody("#formView",function(){
							angular.element(document.getElementById('formView'))
							.append($compile("<generate-directive on-templateuid='template' ></generate-directive>")(scope));
						});
					}
				}
				else {
					scope.template = TemplateUID;
					angular.element(document.getElementById('formView'))
					.append($compile("<generate-directive on-templateuid='template' ></generate-directive>")(scope));
				}
				
			};

			scope.init = function() {
				scope.listView = {
					search:{},
					count:null,
					order:null,
					limit:2,
					offset:0,
					currentPage:1,
					maxSize:1
				};//list view EForm Appointment has value

				scope.listCreate = {
					search:{},
					count:null,
					order:null,
					limit:2,
					offset:0,
					currentPage:1,
					maxSize:1
				};//list Template to create new form

				scope.loadlistView(scope.listView);
				scope.loadlistCreate(scope.listCreate);
			};

			if(scope.apptuid != null && scope.apptuid != "")
				scope.init();
			else
				toastr.error("not Found Appointment","error");

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);

		} // end link

	} // end return

})