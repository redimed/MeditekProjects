angular.module('app.authentication.doctor.directive.detail', [])
.directive('doctorDetail', function(doctorService, CommonService, $filter, $http, $rootScope, $cookies, toastr, $uibModal, $timeout) {

	return {
		restrict: 'EA',
		templateUrl: 'modules/doctor/directives/templates/detail.html',
		scope: {
			uid: '=onUid',
			info:'=onData',
			specialities:'=onSpeciality',
            isShowFull:'=onShowfull',
            listShow:'=onListshow',
            onCancel: '='
		},
		controller:function($scope, FileUploader) {
			// Profile Image
		    var uploader = $scope.uploader = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,

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
		    	var box = document.getElementById('viewIMG');
		    	box.removeAttribute("class");
		    	if($scope.info.FileUID_img!=undefined && $scope.info.FileUID_img!=null &&
		    		$scope.info.FileUID_img!="")
		    		$scope.info.ischangeimg = true;
		    	else
		    		$scope.info.ischangeimg = false;
		    };
		    uploader.onSuccessItem = function (fileItem, response, status, headers) {
		        // console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploader.onBeforeUploadItem = function(item) {
		    	item.headers={
		    		Authorization:'Bearer '+$cookies.get("token"),
		    		systemtype:'WEB',
		    	},
		        console.info('onBeforeUploadItem', item);
		    };
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

		    var uploaders = $scope.uploaders = new FileUploader({
		    	// url: 'http://192.168.1.2:3005/api/uploadFile',
		    	url: o.const.uploadFileUrl,

		    	withCredentials:true,
		    	alias : 'uploadFile'
		    });
		    // FILTERS
		    uploaders.filters.push({
		        name: 'customFilter',
		        fn: function (item /*{File|FileLikeObject}*/, options) {
		            return this.queue.length < 10;
		        }
		    });

		    // CALLBACKS
		    uploaders.onAfterAddingFile = function (fileItem) {
		    	if($scope.info.FileUID_sign!=undefined && $scope.info.FileUID_sign!=null && $scope.info.FileUID_sign!="")
		    		$scope.info.ischangesign = true;
		    	else
		    		$scope.info.ischangesign = false;
		    };
		    uploaders.onBeforeUploadItem = function(item) {
		    	item.headers={
		    		Authorization:'Bearer '+$cookies.get("token"),
		    		systemtype:'WEB',
		    	},
		        console.info('onBeforeUploadItem', item);
		    };
		    uploaders.onSuccessItem = function (fileItem, response, status, headers) {
		        // console.info('onSuccessItem', fileItem, response, status, headers);
		    };
		    uploaders.onCompleteItem = function (fileItem, response, status, headers) {
		        console.info('onCompleteItem', fileItem, response, status, headers);
		        if(Boolean(headers.requireupdatetoken)===true)
		        {
		            $rootScope.getNewToken();
		        }
				console.log($scope.doctorUID);
		        doctorService.updateSignature($scope.doctorUID)
				.then(function(result){
					console.log(result);
				},function(err){
					console.log(err);
				});
		    };
		    uploaders.onErrorItem = function(fileItem, response, status, headers) {
		        console.info('onErrorItem', fileItem, response, status, headers);
		        if(Boolean(headers.requireupdatetoken)===true)
		        {
		            $rootScope.getNewToken();
		        }
		    };

		},
		link: function(scope, ele, attrs) {
			console.log(scope.info);
			scope.doctorUID = {};
			var data = {};
			scope.state = [
				{'code':'VIC', 'name':'Victoria'},
				{'code':'TAS', 'name':'Tasmania'},
				{'code':'QLD', 'name':'Queensland'},
				{'code':'NSW', 'name':'New South Wales'},
				{'code':'WA', 'name':'Western Australia'},
				{'code':'NT', 'name':'Northern Territory'},
				{'code':'ACT', 'name':'Australian Capital Territory'}
			];
			scope.titles = [
				{'id':'Mr', 'name':'Mr'},
				{'id':'Mrs', 'name':'Mrs'},
				{'id':'Ms', 'name':'Ms'},
				{'id':'Dr', 'name':'Dr'}
			];

			var oriInfo,clearInfo;
			// scope.info.img_change = false;
			scope.infoChanged = function() {
		        return angular.equals(oriInfo, scope.info);
		    };

			scope.infoClear = function() {
			    return !angular.equals(clearInfo, scope.info);
		    };

			doctorService.listCountry()
			.then(function(response){
				scope.country = response;
			},function(err){
				console.log(err);
			});

			$timeout(function(){
				var tabtable        = document.getElementById("tabtable");
				var tabtablecontent = document.getElementById("tabtablecontent");
				if(scope.isShowFull==false){
					document.getElementById("box").className = "";
					var tab_UserAccount = document.getElementById("tab_UserAccount");
					var tab1            = document.getElementById("tab1");
					
					tabtable.removeChild(tab1);
					tabtablecontent.removeChild(tab_UserAccount);
					$("#tabtablecontent :input").prop('disabled', true);
				}

				if(scope.listShow!= undefined && scope.listShow!=null && 
					  scope.listShow!='' && scope.listShow.length!=0){
					if(scope.listShow.columm2 && scope.listShow.columm2 == true) {
						document.getElementById("tab2").className = "active";
						document.getElementById("tab_Basic").className = "tab-pane active";
					}
					else if(scope.listShow.columm3 && scope.listShow.columm3 == true) {
						document.getElementById("tab3").className = "active";
						document.getElementById("tab_Contact").className = "tab-pane active";
					}
					else if(scope.listShow.columm4 && scope.listShow.columm4 == true) {
						document.getElementById("tab4").className = "active";
						document.getElementById("tab_signature").className = "tab-pane active";
					}
					
					
				}
				else{
					scope.listShow={
						columm2 : true,
						columm3 : true,
						columm4 : true
					};
				}
		    },0);

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init(); // init todo page
				oriInfo = angular.copy(scope.info);
				$('.select2-multiple').select2();
				$('.select2-container').removeAttr('style');
			},70);

			scope.removeImg = function(value){
				if(value=="ProfileImage"){
			    	scope.info.ischangeimg = null;
			    	scope.uploader.queue.length = 0;
			    	document.getElementById("viewIMG").className = "thumbnail";
			    }
			    if(value=="Signature"){
			    	scope.info.ischangesign = null;
			    	scope.uploaders.queue.length = 0;
			    }
		    };

		    scope.checkDataNull = function(name){
		    	if(scope.info[name].length==0)
		    		scope.info[name] = null;
		    };

		    scope.save = function() {
		    	if(scope.info!=undefined && scope.info!=null){
					if(scope.info.UID!=undefined && scope.info.UID!=null && scope.info.UID!=''){
						data.UID = scope.info.UID;
						data.UserAccountID = scope.info.UserAccountID;
						scope.doctorUID = {
							DoctorUID : scope.info.UID
						};
						delete scope.info['UID'];
						data.info = scope.info;
						data.RoleId = scope.info.UserAccount.RelUserRoles.length!=0?scope.info.UserAccount.RelUserRoles[0].RoleId:null;
					}
				}
		    	doctorService.validate(data.info)
		    	.then(function(result){
		    		scope.er ='';
		    		doctorService.updateDoctor(data)
		    		.then(function(response){
		    			if(response.message=="success"){
		    				if(scope.uploader.queue[0]!=undefined && scope.uploader.queue[0]!=null &&
							   scope.uploader.queue[0]!='' && scope.uploader.queue[0].length!=0){
							   	if(scope.info.ischangeimg==true){
								   	$http({
									  method: 'GET',
									  url: o.const.fileBaseUrl+'/api/enableFile/false/'+scope.info.FileUID_img
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
							if(scope.uploaders.queue[0]!=undefined && scope.uploaders.queue[0]!=null &&
							   scope.uploaders.queue[0]!='' && scope.uploaders.queue[0].length!=0){
							   	console.log(scope.info.ischangesign);
							   	if(scope.info.ischangesign==true){
								   	$http({
									  method: 'GET',
									  url: o.const.fileBaseUrl+'/api/enableFile/false/'+scope.info.FileUID_sign
									}).then(function (response) {
										scope.uploaders.queue[0].formData[0]={};
										scope.uploaders.queue[0].formData[0].fileType = "Signature";
										scope.uploaders.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
										scope.uploaders.uploadAll();
									},function (err) {
										console.log(err);
									});
								}
								else{
									scope.uploaders.queue[0].formData[0]={};
									scope.uploaders.queue[0].formData[0].fileType = "Signature";
									scope.uploaders.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
									scope.uploaders.uploadAll();
								}
							}
		    				toastr.success("Update Successfully!","Success!!");
		    				console.log(scope.uploader.queue);
		    				console.log(scope.uploaders.queue);
		    				scope.onCancel();
		    			}
		    		},function(err){
		    			console.log(err);
		    			toastr.error("Data error, check data again","Error!!!");
			    		scope.er ={};
						scope.ermsg ={};
						if(err.data.message.ErrorsList && err.data.message.ErrorsList.length >0){
							for(var i = 0; i < err.data.message.ErrorsList.length; i++){
								scope.er[err.data.message.ErrorsList[i].field] ={'border': '2px solid #DCA7B0'};
								scope.ermsg[err.data.message.ErrorsList[i].field] = err.data.message.ErrorsList[i].message;
							}
						}
		    		})
		    	},function(err){
		    			console.log(err);
		    		toastr.error("Data error, check data again","Error!!!");
		    		scope.er ={};
					scope.ermsg ={};
					for(var i = 0; i < err.length; i++){
						scope.er[err[i].field] = {};
						scope.er[err[i].field].css ={'border': '2px solid #DCA7B0'};
						scope.er[err[i].field].msg = err[i].message;
					}
		    	});
		    };

		}

	}

});