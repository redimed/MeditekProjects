angular.module('app.authentication.doctor.directive.create', [])
.directive('doctorCreate', function(doctorService, UnauthenticatedService, CommonService, $timeout, $cookies, $filter, toastr, $stateParams, $uibModal, $state) {

	return {
		//
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/create.html',
		options: {
			scope: '='
		},
		controller: function($scope, FileUploader, $state, toastr) {

			// Profile Image
			//create reqeust uploader
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,
		    	headers:{
		    		Authorization:'Bearer '+$cookies.get("token"),
		    		systemtype:'WEB',
		    	},
		    	withCredentials:true,
		    	alias : 'uploadFile'
		    });

		    // FILTERS
		    uploader.filters.push({
		        name: 'customFilter',
		        fn: function (item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 10;
		        }
		    });

		    // CALLBACKS
		    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
		        // console.info('onWhenAddingFileFailed', item, filter, options);
		    };
		    uploader.onAfterAddingFile = function (fileItem) {
		    };

		    uploader.onAfterAddingAll = function (addedFileItems) {
		        // console.info('onAfterAddingAll', addedFileItems);
		    };
		    uploader.onBeforeUploadItem = function (item) {
			        
		    };
		    uploader.onProgressItem = function (fileItem, progress) {
		        // console.info('onProgressItem', fileItem, progress);
		    };
		    uploader.onProgressAll = function (progress) {
		        // console.info('onProgressAll', progress);
		    };
		    uploader.onSuccessItem = function (fileItem, response, status, headers) {
		        // console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploader.onErrorItem = function (fileItem, response, status, headers) {
		        // console.info('onErrorItem', fileItem, response, status, headers);
		    };
		    uploader.onCancelItem = function (fileItem, response, status, headers) {
		        // console.info('onCancelItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteItem = function (fileItem, response, status, headers) {
		        // console.info('onCompleteItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteAll = function () {
		        // console.info('onCompleteAll');
		    };

		},
		link: function(scope, ele, attr) {
			scope.isStep2 = false;
			scope.er={};
			scope.ermsg={};
			$timeout(function(){
				scope.data ={};
				App.initAjax();
				ComponentsDateTimePickers.init(); // init todo page
				FormWizard.init(); // form step
			},50);
			// Variable
			scope.er={};
			scope.isShowNext=true;
			scope.isShowNext2=false;
			scope.isShowNext3=false;
			scope.isShowBack3=false;
			scope.isShowNext4=false;
			scope.isShowBack4=false;
			scope.isShowCreate=false;
			scope.isBlockStep1 =false;
			scope.isBlockStep2 =false;
			scope.isShowNext5=false;

			// Back
			scope.back_1 = function() {
				$("#tab1 :input").removeAttr("disabled");
				scope.isBlockStep1 =false;
				scope.isShowNext=true;
				scope.isShowNext3=false;
				scope.isShowBack3=true;
				scope.isShowNext5=false;
				scope.isShowCreate=false;
			};

			scope.back_2 = function() {
				scope.isBlockStep1 =false;
				scope.isShowNext=false;
				scope.isShowNext3=true;
				scope.isShowBack3=true;
				scope.isShowBack4=false;
				scope.isShowNext5=false;
				scope.isShowCreate=false;
			}

			// State
			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];

			// Title
			scope.titles = [
				{'id':'Mr', 'name':'Mr'},
				{'id':'Mrs', 'name':'Mrs'},
				{'id':'Ms', 'name':'Ms'},
				{'id':'Dr', 'name':'Dr'}
			];

			// Country List
			doctorService.listCountry()
			.then(function(result) {
				scope.country = result;
			}, function(err) {});

			// Department List
			doctorService.listDepartment()
			.then(function(result) {
				scope.department = result;
			}, function(err) {});

			scope.checkDataNull = function(name){
		    	if(scope.data[name].length==0)
		    		scope.data[name] = null;
		    };

			// Check validate and Phone and Email
			scope.checkUserExist = function(data){
				doctorService.validateCheckPhone(data)
				.then(function(result){
					scope.er ={};
					doctorService.validateCheckPhoneonServer(data)
					.then(function(result){
						console.log(result.data);
						if(result.data!="") {
							toastr.error("Wrong data!","Error");
							console.log(result.data[0]);
							scope.er ={};
							scope.ermsg ={};
							for(var i = 0; i < result.data.length; i++){
								scope.er[result.data[i]] ={'border': '2px solid #DCA7B0'};
								scope.ermsg[result.data[i]] = result.data[i]+" already exists" ;
							}
						}
						else {
							toastr.success("Information can use to create!","Successfully");
							$("#tab1 :input").prop('disabled', true);
							scope.isShowNext     = false;
							scope.isShowNext2    = true;
							scope.data.RoleId          = null;
							scope.data.HealthLinkID    = null;
							scope.data.WorkPhoneNumber = null;
							scope.data.HomePhoneNumber = null;
							scope.data.Address1        = null;
							scope.data.Address1        = null;
							scope.data.Postcode        = null;
							scope.data.Suburb          = null;
							scope.data.State           = null;
							scope.data.CountryID       = 14;
						}
					},function(err){
						console.log(err);
					});
				},function(err){
					console.log(err);
					toastr.error("Data error, check data again","Error!!!");
		    		scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				})
			};
			// Variable temp
			scope.show2 = function(){
				scope.isShowNext2=false;
				scope.isShowNext3=true;
				scope.isShowBack3=true;
			};

			scope.CheckInformation = function(data){
				doctorService.validate(data)
				.then(function(success) {
					doctorService.checkInfo(data)
					.then(function(result){
						scope.er ={};
						toastr.success("data Successfully","Successfully");
						scope.isStep2 = true;
						scope.isShowNext3=false;
						scope.isShowNext4=true;
						data.DepartmentID = null;
						data.ProviderNumber = null;
						if(scope.uploader.queue[0]!==undefined && scope.uploader.queue[0]!==null && 
						 scope.uploader.queue[0]!=='' && scope.uploader.queue[0].length!==0){
					    	scope.uploader.queue[0].formData[0]={};
							scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
						
						}
					},function(err){
						scope.er ={};
						scope.ermsg ={};
						for(var i = 0; i < err.data.ErrorsList.length; i++){
							scope.er[err.data.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.ErrorsList[i].field] = err.data.ErrorsList[i].message;
						}
					});	
				}, function(err) {
					toastr.error("Check data again!","Error");
					console.log(err);
					scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				})
				
			};

			scope.create = function(data) {
				// scope.uploader.uploadAll();
				doctorService.validate(data)
				.then(function(response) {
					doctorService.createDoctorByNewAccount(data)
					.then(function(success){
						console.log(success);
						scope.er ={};
						toastr.success("Create Successfully","success");
						if(scope.uploader.queue!==undefined && scope.uploader.queue!==null && 
							scope.uploader.queue!=='' && scope.uploader.queue.length!==0){
							for(var i = 0; i < scope.uploader.queue.length; i++){
								scope.uploader.queue[i].formData[0] ={};
								scope.uploader.queue[i].formData[0].userUID = success.userUID;
							}
							if(scope.uploader.queue[1]!=undefined && scope.uploader.queue[1]!=null && 
							scope.uploader.queue[1]!='' && scope.uploader.queue[1].length!=0){
								scope.uploader.queue[1].formData[0].fileType = "Signature";
							}
							if(scope.uploader.queue[0]!=undefined && scope.uploader.queue[0]!=null && 
							scope.uploader.queue[0]!='' && scope.uploader.queue[0].length!=0){
								scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
							}
							console.log(scope.uploader.queue);
							scope.uploader.uploadAll();
						}
						$state.go('authentication.doctor.list',null, {
			           		'reload': true
			        	});
					}, function(err){
						console.log(err.data.ErrorsList);
			    		scope.er ={};
						scope.ermsg ={};
						for(var i = 0; i < err.data.ErrorsList.length; i++){
							scope.er[err.data.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.ErrorsList[i].field] = err.data.ErrorsList[i].message;
						}
					});
				}, function(err) {
					toastr.error("Check data again!","Error");
					console.log(err);
					scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
				
			};

			// Variable temp
			scope.show4 = function(){
				scope.isShowBack3=false;
				scope.isShowNext4=false;
				scope.isShowCreate=true;
				scope.isShowNext5=true;
				scope.isShowBack4=true;
			};
			// Check validate
			scope.show5 = function(data) {
				doctorService.checkSpec(data)
				.then(function(success) {
					scope.isShowNext5=false;
					scope.isShowCreate=true;
				}, function(err) {});
			};		

		} // end link

	} // end return

})