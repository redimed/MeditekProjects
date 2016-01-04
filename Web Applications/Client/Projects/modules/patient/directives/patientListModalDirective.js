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
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService, $rootScope, $timeout, $cookies, CommonService, $http){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            isShowFull:'=onShowfull',
            listShow:'=onListshow',
            onCancel: '=',
            activeUser: '=onActive'
        },
        controller:function($scope, FileUploader) {
        	$scope.buildImg = function(imageType,canvasimg,ctximg,e, width, height) {
				var reader = new FileReader();
				reader.onload = function(event){
					var img = new Image();
					img.onload = function(){
					    canvasimg.width = width;
				        canvasimg.height = height;
					    ctximg.drawImage(img,0,0,width,height);
					};
					img.src = event.target.result;
				}
				console.log(e.target.files[0]);
				reader.readAsDataURL(e.target.files[0]);
			}

			// Profile Image
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,

		    	withCredentials:true,
		    	alias : 'uploadFile'
		    });
		    // FILTERS
		    uploader.filters.push({
	            name: 'imageFilter',
	            fn: function(item /*{File|FileLikeObject}*/, options) {
	                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	            }
	        });

		    // CALLBACKS
		    uploader.onAfterAddingFile = function (fileItem) {
		    	for(var i = 0; i < uploader.queue.length; i++){
		    		if(uploader.queue[i].formData.length!=0){
		    			if(uploader.queue[i].formData[0].fileType==$scope.typeFile){
		    				uploader.queue.splice(i,1);
		    			}
		    		}
		    	}
		    	fileItem.formData[0] = {};
		    	fileItem.formData[0].fileType = $scope.typeFile;
		    	if($scope.typeFile == "ProfileImage"){
		    		$scope.isChoseAvatar = true;
		    		$scope.info.changeimg = 1;
		    	}
		    	console.log(uploader.queue);
		    };
		    uploader.onBeforeUploadItem = function(item) {
		    	item.headers={
		    		Authorization:'Bearer '+$cookies.get("token"),
		    		systemtype:'WEB',
		    	},
		        console.info('onBeforeUploadItem', item);
		    };
		    // uploader.onSuccessItem = function (fileItem, response, status, headers) {
		    //     console.info('onSuccessItem', fileItem, response, status, headers);
		    // };
		    uploader.onCompleteItem = function (fileItem, response, status, headers) {
		        console.info('onCompleteItem', fileItem, response, status, headers);
		        if(Boolean(headers.requireupdatetoken)===true)
		        {
		            $rootScope.getNewToken();
		        }
		    };
		    uploader.onErrorItem = function(fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		        if(Boolean(headers.requireupdatetoken)===true)
		        {
		            $rootScope.getNewToken();
		        }
		    };
		},
		link: function(scope, elem, attrs){
			console.log(scope.activeUser);
			scope.isChoseAvatar = false;
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
					console.log(scope.info);
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

		    scope.changeEnable = function(Enable) {
		    	scope.info.EnableUser = Enable;
		    	console.log(Enable);
		    };

		    scope.savechange = function(){

				PatientService.validate(scope.info)
					.then(function(result){
						scope.er ='';
						scope.ermsg ='';
						scope.info.RoleId = scope.info.UserAccount.RelUserRoles.length!=0?null:3;
						PatientService.updatePatient(scope.info).then(function(response){
							if(scope.uploader.queue[0]!=undefined && scope.uploader.queue[0]!=null &&
							   scope.uploader.queue[0]!='' && scope.uploader.queue[0].length!=0){
							   	// if(scope.typeFile=="imageAvatar"){
							   		scope.imgDelete = scope.info.FileUID?scope.info.FileUID:null;
							   		if(scope.imgDelete != null){
									   	$http({
										  method: 'GET',
										  url: o.const.fileBaseUrl+'/api/enableFile/false/'+scope.imgDelete
										}).then(function (response) {
											// scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
											// scope.uploader.uploadAll();
										},function (err) {
											console.log(err);
										});
									}
								// }
							}
							scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
							scope.uploader.uploadAll();
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

			scope.typeFile;
			scope.setType = function(value){
				scope.typeFile=value;
				if(value=="ProfileImage"){
					var imageAvatar = document.getElementById('imageAvatar');
					    imageAvatar.addEventListener('change', handleImage, false);
					var canvas = document.getElementById('imageAvatarCanvas');
					var ctx = canvas.getContext('2d');

					function handleImage(e){
						scope.buildImg(imageAvatar, canvas, ctx,e,350,350);
					}
				}
			};


			scope.Remove = function(value) {
				delete scope.info['changeimg'];
				for(var i = 0; i < scope.uploader.queue.length;i++) {
					if(scope.uploader.queue[i].formData[0].fileType==value){
						scope.uploader.queue.splice(i,1);
					}
				}
				if(value=="ProfileImage"){
					scope.isChoseAvatar = false;
				}
			}

			

			AuthenticationService.getListCountry().then(function(result){
				scope.countries = result.data;
			},function(err){
				toastr.error("error data country","ERROR");
			});

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

			// Title
			scope.titles = [
				{'id':'Mr', 'name':'Mr'},
				{'id':'Mrs', 'name':'Mrs'},
				{'id':'Ms', 'name':'Ms'},
				{'id':'Dr', 'name':'Dr'}
			];

			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];
		},
		templateUrl:'modules/patient/directives/template/patientListModal.html'
	};
});