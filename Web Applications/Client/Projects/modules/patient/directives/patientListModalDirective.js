var app = angular.module('app.authentication.patient.list.modal.directive',[]);
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService, $timeout, $cookies, CommonService){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            onCancel: '='
        },
        controller:function($scope, FileUploader) {
			// Profile Image
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://testapp.redimed.com.au:3005/api/uploadFile',
		    	url: 'http://192.168.1.2:3005/api/uploadFile',
		    	headers:{Authorization:'Bearer '+$cookies.get("token")},
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
		        console.info('onWhenAddingFileFailed', item, filter, options);
		    };
		    uploader.onAfterAddingFile = function (fileItem) {
		        console.info('onAfterAddingFile', fileItem);
		    };

		    uploader.onAfterAddingAll = function (addedFileItems) {
		        console.info('onAfterAddingAll', addedFileItems);
		    };
		    uploader.onBeforeUploadItem = function (item) {
		        console.info('onBeforeUploadItem', item);
		    };
		    uploader.onProgressItem = function (fileItem, progress) {
		        console.info('onProgressItem', fileItem, progress);
		    };
		    uploader.onProgressAll = function (progress) {
		        console.info('onProgressAll', progress);
		    };
		    uploader.onSuccessItem = function (fileItem, response, status, headers) {
		        console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploader.onErrorItem = function (fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		    };
		    uploader.onCancelItem = function (fileItem, response, status, headers) {
		        console.info('onCancelItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteItem = function (fileItem, response, status, headers) {
		        console.info('onCompleteItem', fileItem, response, status, headers);
		    };
		    uploader.onCompleteAll = function () {
		        console.info('onCompleteAll');
		    };
		},
		link: function(scope, elem, attrs){
			var oriInfo,clearInfo;
			var data = {};
			data.UID = scope.uid;
			scope.info = {};
			scope.infoChanged = function() {
		        return angular.equals(oriInfo, scope.info);
		    },

			scope.infoClear = function() {
			    return !angular.equals(clearInfo, scope.info);
		    },

		    $timeout(function(){
		    	App.initComponents(); // init core components
		    	ComponentsSelect2.init(); // init todo page
	            ComponentsBootstrapSelect.init(); // init todo page
	            ComponentsDateTimePickers.init(); // init todo page
		    },0);

		    scope.changeImg = function(){
		    	console.log(scope.uploader);
		    };

		    scope.checkDataNull = function(name){
		    	if(scope.info[name].length==0)
		    		scope.info[name] = null;
		    };

		    scope.savechange = function(){
				PatientService.validate(scope.info)
					.then(function(result){
						scope.er ='';
						scope.ermsg ='';
						PatientService.updatePatient(scope.info).then(function(response){
							if(scope.uploader.queue[0]!=undefined && scope.uploader.queue[0]!=null &&
							   scope.uploader.queue[0]!='' && scope.uploader.queue[0].length!=0){
								scope.uploader.queue[0].formData[0]={};
								scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
								scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
								scope.uploader.uploadAll();
							}
							toastr.success("update success!!!","SUCCESS");
							scope.onCancel();
						},function(err){
							toastr.error(err.data.message.errors,"ERROR");
							scope.info = angular.copy(oriInfo);
						});
				}, function(err){
					toastr.error("Please check data again.","ERROR");
					scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] ={'border': '2px solid #DCA7B0'};
						scope.ermsg[err[i].field] = err[i].message;
					}
				})
			},

			PatientService.detailPatient(data).then(function(response){
				console.log(scope.uploader.queue.length);
				if(response.message=="success"){
					scope.info = response.data[0];
					scope.info.img = scope.info.FileUID?CommonService.ApiUploadFile+scope.info.FileUID:null;
					scope.info.img_change=false;
					scope.info.DOB = new Date(scope.info.DOB);
					
					oriInfo = angular.copy(scope.info);
				}
				else{
					console.log(response.message);
				}
			});

			AuthenticationService.getListCountry().then(function(result){
				scope.countries = result.data;
			},function(err){
				toastr.error("error data country","ERROR");
			});

			scope.titles = [
				{id:"0", name:'Mr'},
				{id:"1", name:'Mrs'},
				{id:"2", name:'Ms'},
				{id:"3", name:'Dr'}
			];

			scope.states = [
				{ name: 'Victoria' },
				{ name: 'New South Wales' },
				{ name: 'Queensland' },
				{ name: 'Austria Capital Territory' },
				{ name: 'Northern Territory' },
				{ name: 'Western Australia' },
				{ name: 'Tasmania' }
			];

			scope.insurers = [
				{name: 'Insurer Company'},
				{name: 'Mineral Resources'},
				{name: 'Mesa Minerals'}
			];
			scope.Account_types = [
				{name: 'Titanium Privilege Account'},
				{name: '3-in-1 Account'},
				{name: 'Silver Savings Account'}
			];
		},
		templateUrl:'modules/patient/directives/template/patientListModal.html'
	};
});