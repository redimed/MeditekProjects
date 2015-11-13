//DIRECTIVE PATIENT LIST MODAL : show patient info
// <patient-listmodal 
// 		on-uid="patientUID"       : patient UID was added in this to get data patient from this UID
// 		on-showfull="false"       : this attribute allow you to show full template of this directive
//									(true or false), if this attribute not require default is true
// 		on-listshow="list"        : array list to show some columms in this directive 
//                            		list={columm1 : true,columm2 : false,columm3 : true};
//									if list not require, this directive will show 3 columm default 
// 		ng-if="patientUID!=null"> : this attribute allow you to show this directive when patientUID exists
// </patient-listmodal>

var app = angular.module('app.authentication.patient.list.modal.directive',[]);
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService, $timeout, $cookies, CommonService, $http){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            isShowFull:'=onShowfull',
            listShow:'=onListshow',
            onCancel: '='
        },
        controller:function($scope, FileUploader) {
			// Profile Image
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
		    uploader.onAfterAddingFile = function (fileItem) {
		    	if($scope.info.img){
		    		$scope.info.FileType = 'ProfileImage';
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

			// Title
			scope.titles = [
				{'id':'Mr', 'name':'Mr'},
				{'id':'Mrs', 'name':'Mrs'},
				{'id':'Ms', 'name':'Ms'},
				{'id':'Dr', 'name':'Dr'}
			];

			scope.state = [
				{'code':'Victoria', 'name':'Victoria'},
				{'code':'Tasmania', 'name':'Tasmania'},
				{'code':'Queensland', 'name':'Queensland'},
				{'code':'New_South_Wales', 'name':'New South Wales'},
				{'code':'Western_Australia', 'name':'Western Australia'},
				{'code':'Northern_Territory', 'name':'Northern Territory'},
				{'code':'Austria_Capital_Territory', 'name':'Austria Capital Territory'}
			];
			var data = {};
        	scope.info = {};
			data.UID = scope.uid;
			data.FileType = 'ProfileImage';
			PatientService.detailPatient(data).then(function(response){
				if(response.message=="success"){
					scope.info = response.data[0];
					scope.info.DOB = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.test(scope.info.DOB)?scope.info.DOB:null;
					scope.info.img = scope.info.FileUID?scope.info.FileUID:null;
					scope.info.img_change = null;
					oriInfo = angular.copy(scope.info);
				}
				else{
					console.log(response.message);
				}
			});
			scope.imgDelete;
			var oriInfo,clearInfo;
			
			scope.infoChanged = function() {
		        return angular.equals(oriInfo, scope.info);
		    };

			scope.infoClear = function() {
			    return !angular.equals(clearInfo, scope.info);
		    };

		    scope.removeImg = function(){
		    	scope.info.img_change =null;
		    	scope.uploader.queue.length = 0;
		    };
		    $timeout(function(){
		    	scope.checkcolumm =[];
				if(scope.listShow!= undefined && scope.listShow!=null && scope.listShow!='' && scope.listShow.length!=0){
					if(scope.listShow.columm1==true){
						scope.checkcolumm.push({have:"columm1"});
					}
					if(scope.listShow.columm2==true){
						scope.checkcolumm.push({have:"columm2"});
					}
					if(scope.listShow.columm3==true){
						scope.checkcolumm.push({have:"columm3"});
					}
				}
				else{
					scope.listShow={
						columm1 : true,
						columm2 : true,
						columm3 : true
					};
				}
				switch(scope.checkcolumm.length) {
				    case 1:
				        if(scope.checkcolumm[0].have!=null && scope.checkcolumm[0].have!=undefined
				        	&& scope.checkcolumm[0].have!=''){
				        	$('#'+scope.checkcolumm[0].have).before("<div class='col-md-4'></div>");
				        }
				        break;
				    case 2:
				        for(var i = 0; i < scope.checkcolumm.length; i++){
				        	if(scope.checkcolumm[i].have!=null && scope.checkcolumm[i].have!=undefined
				        	&& scope.checkcolumm[i].have!=''){
				        		document.getElementById(scope.checkcolumm[i].have).className = "col-md-6";
				        	}
				        }
				        break;
				}
		    },0);

		    $timeout(function(){
				scope.isShowFull = scope.isShowFull!=undefined&&scope.isShowFull!=null?scope.isShowFull:true;
				if(scope.isShowFull==false){
					document.getElementById("modalContent").className = "";
					document.getElementById("modalBody").className = "";
					document.getElementById("tabContent1").className = "";
					document.getElementById("tabBable").className = "";
					document.getElementById("tabContent2").className = "";
					document.getElementById("Personal_info").className = "";
				};
				App.initAjax();
    			ComponentsDateTimePickers.init(); // init todo page
		    },50);

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
									  url: o.const.fileBaseUrl+'/api/enableFile/false/'+scope.imgDelete
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