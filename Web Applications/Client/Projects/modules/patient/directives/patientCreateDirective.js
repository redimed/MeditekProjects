var app = angular.module('app.authentication.patient.create.directive',[]);
app.directive('patientCreate',function(toastr, PatientService, $state, $timeout, FileUploader, $cookies){
	return {
		restrict: "EA",
		link: function(scope, elem, attrs){
			scope.er={};
			scope.ermsg={};
			scope.isShowNext=false;
			scope.isBlockStep1 =false;
			scope.Back = function() {
				scope.isShowNext=false;
				scope.isShowCreate=false;
				scope.isBlockStep1=false;
			};
			//event timeout will call after this template's directive rendered
			$timeout(function(){
				App.setAssetsPath('theme/assets/'); // Set the assets folder path	
				FormWizard.init(); // form step
			},0); 
			scope.checkPhone = function(data) {
				PatientService.validateCheckPhone(data)
				.then(function(success){
					scope.er ='';
					scope.ermsg='';
					scope.isBlockStep1=true;
					PatientService.checkPatient(data)
					.then(function(result){
						if(result!=undefined && result!=null && result!='' && result.length!=0){
							if(result.data.isCreated==false){
								scope.er ='';
								scope.ermsg='';
								toastr.success("Phone number can user to create patient","SUCCESS");
								scope.isShowEmail = result.data.data.Email;
								scope.data.Email = result.data.data.Email;
								scope.isShowNext = true;
							}
							else{
								toastr.error("Phone Number da duoc tao patient","ERROR");
								scope.isBlockStep1 =false;
							}
						}
					}, function(err){
						scope.er={};
						scope.ermsg={};
						toastr.error("Please input correct information","ERROR");
						for(var i = 0; i < err.data.message.ErrorsList.length;i++){
							scope.er[err.data.message.ErrorsList[i].field] = {'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
						}
					});
				},function (err){
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
				
			};

			scope.Cancel = function() {
				$state.go('authentication.patient.list',null, {
		            'reload': true
		        });
			};

			scope.createPatient = function(data) {
				return PatientService.validate(data)
				.then(function(result){
					return PatientService.createPatient(data)
					.then(function(success){
						toastr.success("Create Successful!!","SUCCESS");
						$state.go('authentication.patient.list',null, {
		           			'reload': true
		        		});
					},function(err){
						scope.er={};
						scope.ermsg={};
						toastr.error("Please check data again.","ERROR");
						scope.er = scope.er?scope.er:{};
						for(var i = 0; i < err.data.message.ErrorsList.length; i++){
							scope.er[err.data.message.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
							scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
						}
					});
				},function(err){
					scope.er={};
					scope.ermsg={};
					toastr.error("Please check data again.","ERROR");
					scope.er = scope.er?scope.er:{};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				});
			};

			scope.SendRequestUploadFile = function () {
		        for (var i = 0; i < uploader.queue.length; i++) {
		            console.log(' uploader.queue', uploader.queue);
		            var item = uploader.queue[i];
		            item.formData[i] = {};
		            item.formData[i].userUID = $cookies.getObject('userInfo').UID;
		            item.formData[i].fileType = 'MedicalImage';
		        };
		        uploader.uploadAll();
		    }


		    var uploader = scope.uploader = new FileUploader({
		        url: 'http://telehealthvietnam.com.vn:3005/api/uploadFile',
		        alias: 'uploadFile'
		    });

		    // FILTERS

		    uploader.filters.push({
		        name: 'customFilter',
		        fn: function(item /*{File|FileLikeObject}*/ , options) {
		            return this.queue.length < 10;
		        }
		    });

		    // CALLBACKS

		    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
		        console.info('onWhenAddingFileFailed', item, filter, options);
		    };
		    uploader.onAfterAddingFile = function(fileItem) {
		        console.info('onAfterAddingFile', fileItem);
		    };
		    uploader.onAfterAddingAll = function(addedFileItems) {
		        console.info('onAfterAddingAll', addedFileItems);
		    };
		    uploader.onBeforeUploadItem = function(item) {
		        console.info('onBeforeUploadItem', item);
		    };
		    uploader.onProgressItem = function(fileItem, progress) {
		        console.info('onProgressItem', fileItem, progress);
		    };
		    uploader.onProgressAll = function(progress) {
		        console.info('onProgressAll', progress);
		    };
		    uploader.onSuccessItem = function(fileItem, response, status, headers) {
		        console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploader.onErrorItem = function(fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		    };
		    uploader.onCancelItem = function(fileItem, response, status, headers) {
		        console.info('onCancelItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteItem = function(fileItem, response, status, headers) {
		        console.info('onCompleteItem', fileItem, response, status, headers);
		        if (response.status == 'success') {
		            scope.requestInfo.FileUploads.push({UID:response.fileUID});
		        };
		    };
		    uploader.onCompleteAll = function() {
		    	
		    };

		},
		templateUrl:"modules/patient/directives/template/patientCreate.html"
	}
});