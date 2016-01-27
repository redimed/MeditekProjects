angular.module('app.authentication.eForms.directive.question11', [])
.directive('question11', function(PatientService, $uibModal, $state, toastr,$timeout, $compile, $cookies) {

	return {

		restrict: 'EA',
		templateUrl: 'modules/eForms/directives/templates/question11.html',
		scope:{
			info:'=onData',
			option:'=onOption',
			value:'=onValue',
			isEditor:'=onEditor',
			questionImg:'=onQuestionimg',
			nameValue:'=onGetname'
		},
		controller: function($scope, FileUploader) {
			$scope.disable == true?true:false;
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
		    	if($scope.typeFile == "QuestionImage"){
		    		$scope.isChoseAvatar = true;
		    	}
		    	console.log(uploader);
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
		    uploader.onSuccessItem = function(item, response, status, headers) {
		    	console.log(response);
		    	$scope.option.value3 = response.fileUID;
		    };
		},
		link: function(scope, ele, attr) {
			console.log(scope.nameValue);
			scope.userInfo = $cookies.getObject('userInfo');
			scope.idform = 'form_editor '+Math.random();
			scope.editor = scope.isEditor?scope.isEditor:false;

			scope.setType = function(value){
				scope.typeFile=value;
				if(value=="QuestionImage"){
					var imageAvatar = document.getElementById('imageAvatar');
					    imageAvatar.addEventListener('change', handleImage, false);
					var canvas = document.getElementById('imageAvatarCanvas');
					var ctx = canvas.getContext('2d');

					function handleImage(e){
						scope.buildImg(imageAvatar, canvas, ctx,e,350,350);
					}
				}
			};

			scope.SaveImage = function() {
				if(scope.uploader.queue[0]!=undefined && scope.uploader.queue[0]!=null &&
					scope.uploader.queue[0]!='' && scope.uploader.queue[0].length!=0){
					//viet lai phan disable file
					var postData = {};
					postData.UserAccountID = scope.userInfo.UserAccountID;
					postData.FileType = [];
				   //end
				   scope.uploader.queue[0].formData[0].userUID = scope.userInfo.UID;
					// scope.uploader.uploadAll();
				}
			};

			// co 2 solution :
			// solution thu 1 : truyen tat ca queu ve cho CreateDirective va Create Directive se uploadAll 

			// solution thu 2 : o moi question nay se co nut save, khi save thi se upload luon va tra ve uid
								// sau do push question name va section name vao de biet la 
								// question thu may va section thu may dung loai cau hoi nay,
								// gia su nhu cancel k create Eform thi se goi 1 APIs truyen vao cac uid da upload len va disable tat ca file do

			$timeout(function(){
				App.initAjax();
				ComponentsDateTimePickers.init();
			},0);
			
			

		} // end link

	} // end return

})