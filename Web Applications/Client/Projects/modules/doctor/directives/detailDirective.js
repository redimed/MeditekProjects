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
		    	// var box = document.getElementById('viewIMG');
		    	// box.removeAttribute("class");
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
		    	if($scope.typeFile == "Signature"){
		    		$scope.isChoseSignature = true;
		    		$scope.info.changeimg = 1;
		    	}
		    	console.log(uploader.queue);
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

		},
		link: function(scope, ele, attrs) {
			console.log(scope.info);
			scope.isChoseAvatar = false;
			scope.isChoseSignature = false;
			scope.doctorUID;
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
			scope.configpage = function() {
				$('.select2-multiple').select2();
				$('.select2-container').removeAttr('style');
			};
			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init(); // init todo page
				oriInfo = angular.copy(scope.info);
				// $('.select2-multiple').select2();
				// $('.select2-container').removeAttr('style');
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
						scope.doctorUID =  scope.info.UserAccountID;
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
							   	//viet lai phan disable file
								var postData = {};
								postData.UserAccountID = scope.info.UserAccountID;
								postData.Enable="N";
								postData.FileType = [];
							   	for(var i = 0; i < scope.uploader.queue.length; i++) {
							   		scope.uploader.queue[i].formData[0].userUID = scope.info.UserAccount.UID;
							   		postData.FileType.push(scope.uploader.queue[i].formData[0].fileType);
							   	}
							   	doctorService.changeStatusFile(postData)
							   	.then(function(result){
							   		console.log(result);
							   		scope.uploader.uploadAll();
							   	},function(err){
							   		console.log(err);
							   		if(err.data.errors[0] == "FileType.Null"){
							   			// console.log("FileType.Null");
							   			scope.uploader.uploadAll();
							   		}
							   	});
							   //end
							}
		    				toastr.success("Update Successfully!","Success!!");
		    				console.log(scope.uploader.queue);
		    				console.log(scope.onCancel);
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
						if(err[i].field == "Speciality"){
							$(".select2-selection").css("border","2px solid #DCA7B0");
						}
					}
		    	});
		    };

		    scope.typeFile;
			scope.setType = function(value){
				scope.typeFile=value;
				if(value=="ProfileImage"){
					var imageAvatar = document.getElementById('imageAvatar');
					    imageAvatar.addEventListener('change', handleImage, false);
					var canvas = document.getElementById('imageAvatarCanvas');
					var ctx = canvas.getContext('2d');

					function handleImage(e){
						scope.buildImg(imageAvatar, canvas, ctx,e,275,300);
					}
				}
				else if(value =="Signature") {
					var imageSignature = document.getElementById('imageSignature');
			    		imageSignature.addEventListener('change', handleImage2, false);
					var canvas1 = document.getElementById('imageSignatureCanvas');
					var ctx1 = canvas1.getContext('2d');
					function handleImage2(e){
						scope.buildImg(imageSignature, canvas1, ctx1,e,550,280);    
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
				else if(value=="Signature"){
					scope.isChoseSignature = false;
				}
			}

		}

	}

});