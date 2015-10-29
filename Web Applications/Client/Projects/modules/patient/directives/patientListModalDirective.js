var app = angular.module('app.authentication.patient.list.modal.directive',[]);
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService, $timeout, $cookies, CommonService, $http){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            onCancel: '='
        },
        controller:function($scope, FileUploader) {
			// Profile Image
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,
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
		    uploader.onAfterAddingFile = function (fileItem) {
		    	if($scope.info.img){
		    		PatientService.getfileUID($scope.info).then(function(response){
		    			$scope.info.img_change = true;
		    			$scope.imgDelete = response.data[0].UID;		    		
		    		});
		    	}
		    	else{
		    		$scope.info.img_change = false;
		    	}
		    };
		    // uploader.onSuccessItem = function (fileItem, response, status, headers) {
		    //     console.info('onSuccessItem', fileItem, response, status, headers);
		    // };

		},
		link: function(scope, elem, attrs){
			scope.imgDelete;
			var oriInfo,clearInfo;
			var data = {};
			data.UID = scope.uid;
			scope.info = {};
			scope.infoChanged = function() {
		        return angular.equals(oriInfo, scope.info);
		    };

			scope.infoClear = function() {
			    return !angular.equals(clearInfo, scope.info);
		    };

		    scope.removeImg = function(){
		    	scope.info.img_change =null;
		    	scope.uploader.queue.length = 0;
		    }

		    $timeout(function(){
		    	App.initComponents(); // init core components
		    	ComponentsSelect2.init(); // init todo page
	            ComponentsBootstrapSelect.init(); // init todo page
	            ComponentsDateTimePickers.init(); // init todo page
		    },0);

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
							   	if(scope.info.img){
								   	$http({
									  method: 'GET',
									  url: o.const.enableFileUrl+'/false/'+scope.imgDelete
									}).then(function (response) {
										scope.uploader.queue[0].formData[0]={};
										scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
										scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
										scope.uploader.uploadAll();
									},function (err) {
										console.log(err);
									});
								}
								else{
									scope.uploader.queue[0].formData[0]={};
									scope.uploader.queue[0].formData[0].fileType = "ProfileImage";
									scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
									scope.uploader.uploadAll();
								}
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
				if(response.message=="success"){
					scope.info = response.data[0];
					scope.info.DOB = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.test(scope.info.DOB)?scope.info.DOB:null;
					scope.info.img = scope.info.FileUID?o.const.downloadFileUrl+"/300/"+scope.info.FileUID:null;
					scope.info.img_change = null;
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