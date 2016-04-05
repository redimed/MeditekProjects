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
app.directive('patientListmodal', function(PatientService, $state, toastr, AuthenticationService, $rootScope, $timeout, $cookies, CommonService, $http, $uibModal, $compile){
	return{
		restrict: 'EA',
        scope: {
            uid: '=onUid',
            isShowFull:'=onShowfull',
            listShow:'=onListshow',
            onCancel: '=',
            disable :'=onDisabled',
            activeUser: '=onActive'
        },
        controller:function($scope, FileUploader) {
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
		    	item.headers.Authorization = 'Bearer ' + $cookies.get("token");
                item.headers.systemtype = 'WEB';
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
		    uploader.onSuccessItem = function(item, response, status, headers) {
		    	console.log(response);
		    }
		},
		link: function(scope, elem, attrs){
			scope.changeoption = false;
			scope.typeShow;
			console.log(scope.activeUser);
			scope.isHaveKins;
			scope.isHaveGPs;
			scope.isHaveFunds;
			scope.isHaveDVAs;
			scope.isHavePensions;
			scope.isHaveMedicares;
			scope.isChoseAvatar = false;
			var data = {};
			scope.updatedata = {};
        	scope.info = {};
        	scope.style = {};
			data.UID = scope.uid;
			data.FileType = 'ProfileImage';

			scope.view = function(model, data) {
				scope.style = {};
				console.log(scope.info[model]);
				if(model == 'Kin'){
					scope.callData(scope.typeShow,scope.chooseItem,true);
					console.log(scope.isHaveKins);
					if(scope.isHaveKins == null || scope.isHaveKins != data) {
						scope.chooseItem = true;
						scope.isHaveKins = data;
						delete scope.info['PatientGP'];
						delete scope.info['PatientPension'];
						delete scope.info['PatientDVA'];
						delete scope.info['PatientMedicare'];
						delete scope.info['PatientFund'];
						scope.info.PatientKin = angular.copy(data);;
						console.log(scope.info.PatientKin);
					}
					else if (scope.isHaveKins == data) {
						scope.chooseItem = false;
						scope.isHaveKins = null;
						delete scope.info['PatientKin'];
					}
				} 
				else if(model == 'GP'){
					scope.callData(scope.typeShow,scope.chooseItem,true);
					console.log(scope.isHaveGPs);
					if(scope.isHaveGPs == null || scope.isHaveGPs != data) {
						scope.chooseItem = true;
						scope.isHaveGPs = data;
						delete scope.info['PatientPension'];
						delete scope.info['PatientDVA'];
						delete scope.info['PatientKin'];
						delete scope.info['PatientMedicare'];
						delete scope.info['PatientFund'];
						scope.info.PatientGP = angular.copy(data);
						console.log(scope.info.PatientGP);
					}
					else if (scope.isHaveGPs == data) {
						scope.chooseItem = false;
						scope.isHaveGPs = null;
						delete scope.info['PatientGP'];
					}
				}
				else if(model == 'Fund'){
					console.log(scope.isHaveFunds);
					scope.callData(scope.typeShow,scope.chooseItem,true);
					if(scope.isHaveFunds == null || scope.isHaveFunds != data) {
						scope.chooseItem = true;
						scope.isHaveFunds = data;
						delete scope.info['PatientGP'];
						delete scope.info['PatientPension'];
						delete scope.info['PatientDVA'];
						delete scope.info['PatientKin'];
						delete scope.info['PatientMedicare'];
						scope.info.PatientFund = angular.copy(data);;
						console.log(scope.info.PatientFund);
					}
					else if (scope.isHaveFunds == data) {
						scope.chooseItem = false;
						scope.isHaveFunds = null;
						delete scope.info['PatientFund'];
					}
				}
				else if(model == 'Pension'){
					scope.callData(scope.typeShow,scope.chooseItem,true);
					console.log(scope.isHavePensions);
					if(scope.isHavePensions == null || scope.isHavePensions != data) {
						if(data.ExpiryDate && /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(data.ExpiryDate) == false) data.ExpiryDate = moment(data.ExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY');
						scope.chooseItem = true;
						scope.isHavePensions = data;
						delete scope.info['PatientGP'];
						delete scope.info['PatientDVA'];
						delete scope.info['PatientKin'];
						delete scope.info['PatientMedicare'];
						delete scope.info['PatientFund'];
						scope.info.PatientPension = angular.copy(data);;
						console.log(scope.info.PatientPension);
					}
					else if (scope.isHavePensions == data) {
						scope.chooseItem = false;
						scope.isHavePensions = null;
						delete scope.info['PatientPension'];
					}
				}
				else if(model == 'DVA'){
					scope.callData(scope.typeShow,scope.chooseItem,true);
					console.log(scope.isHaveDVAs);
					if(scope.isHaveDVAs == null || scope.isHaveDVAs != data) {
						scope.chooseItem = true;
						scope.isHaveDVAs = data;
						delete scope.info['PatientGP'];
						delete scope.info['PatientPension'];
						delete scope.info['PatientKin'];
						delete scope.info['PatientMedicare'];
						delete scope.info['PatientFund'];
						scope.info.PatientDVA = angular.copy(data);;
						console.log(scope.info.PatientDVA);
					}
					else if (scope.isHaveDVAs == data) {
						scope.chooseItem = false;
						scope.isHaveDVAs = null;
						delete scope.info['PatientDVA'];
					}
				}
				else if(model == 'Medicare'){
					scope.callData(scope.typeShow,scope.chooseItem,true);
					console.log(scope.isHaveMedicares);
					if(data.ExpiryDate && /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(data.ExpiryDate) == false) data.ExpiryDate = moment(data.ExpiryDate,'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY');
					if(scope.isHaveMedicares == null || scope.isHaveMedicares != data) {
						scope.chooseItem = true;
						scope.isHaveMedicares = data;
						delete scope.info['PatientGP'];
						delete scope.info['PatientPension'];
						delete scope.info['PatientDVA'];
						delete scope.info['PatientKin'];
						delete scope.info['PatientFund'];
						scope.info.PatientMedicare = angular.copy(data);;
						console.log(scope.info.PatientMedicare);
					}
					else if (scope.isHaveMedicares == data) {
						scope.chooseItem = false;
						scope.isHaveMedicares = null;
						delete scope.info['PatientMedicare'];
					}
				}
			}

			scope.selectType = function(type) {
				if(scope.typeShow != type)
					$('#add1').show();
				scope.typeShow = type;
			}

			scope.callData = function( model, isChoose, ischangeView) {
				scope.typeShow = model;
				scope.style = {};
				scope.chooseItem = false;
				var ischangeview = false;
				if(isChoose) {
					scope.chooseItem = isChoose;
				}
				if(ischangeView) {
					ischangeview = ischangeView;
				}
				PatientService.detailChildPatient({ UID: scope.info.UID , model: [model], where:{Enable:'Y'} })
				.then(function(response) {
					scope.info[model+'s'] = response.data[model];
					console.log(scope.chooseItem);
					if(scope.chooseItem == true && ischangeview == false) {
						scope.typeShow = model;
						scope.info[scope.typeShow] = scope.info[model+'s'][scope.info[model+'s'].length-1];
						if(scope.info[scope.typeShow]['ExpiryDate'] && /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(scope.info[scope.typeShow]['ExpiryDate']) == false) {
							scope.info[scope.typeShow]['ExpiryDate'] = moment(scope.info[scope.typeShow]['ExpiryDate'],'YYYY-MM-DD HH:mm:ss Z').format('DD/MM/YYYY');
						}
					}

				},function(err) {
					console.log(err);
				});
			}

			scope.validateChild = function( model, attr, regexChar, message, required) {
				if(scope.info[model]) {
					if(scope.info[model][attr]) {
						if(required) {
							//if input must be required
						}
						else {
							var regexchar = new RegExp(regexChar);
							console.log(regexchar);
							console.log(scope.info[model][attr]);
							console.log(regexchar.test(scope.info[model][attr]));
							if(regexchar.test(scope.info[model][attr]) == false) {
								scope.style[attr] = {};
								scope.style[attr].css = {'border': '2px solid #DCA7B0'};
								if(!message)
									scope.style[attr].message = attr + ' Invalid';
								else
									scope.style[attr].message = message;
							}
							else {
								delete scope.style[attr];
							}
						}
					}
					else {
						delete scope.style[attr];
					}
				}
			}

			scope.init = function(){
				PatientService.detailPatient(data).then(function(response){
					if(response.message=="success"){
						scope.info = response.data[0];
						//scope.info.PatientKins = {};
						scope.info.DOB = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.test(scope.info.DOB)?scope.info.DOB:null;
						scope.info.img = scope.info.FileUID?scope.info.FileUID:null;
						scope.info.InterperterLanguage = parseInt(scope.info.InterperterLanguage);
						scope.info.img_change = null;
						// scope.info.PatientMedicare.ExpiryDate = moment(scope.info.PatientMedicare.ExpiryDate,'YYYY-MM-DD').format('DD/MM/YYYY');
						if(scope.info.PatientMedicare != null){
							if(scope.info.PatientMedicare != null && scope.info.PatientMedicare != ""){
								var date = new Date(scope.info.PatientMedicare.ExpiryDate);
								scope.info.PatientMedicare.ExpiryDate = moment(date).format('DD/MM/YYYY');
							}
						}
						if(scope.info.PatientPension != null){
							if(scope.info.PatientPension.ExpiryDate != null && scope.info.PatientPension.ExpiryDate != ""){
								var date = new Date(scope.info.PatientPension.ExpiryDate);
								scope.info.PatientPension.ExpiryDate = moment(date).format('DD/MM/YYYY');
							}
						}
						console.log(scope.info);
						oriInfo = angular.copy(scope.info);
					}
					else{
						console.log(response.message);
					}
				});
			}

			scope.init();

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
		    	if(scope.disable == true) {
		    		$('#modalBody :input').attr('disabled', true);
		    	}
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
					// document.getElementById("modalBody").className = "";
					// document.getElementById("tabContent1").className = "";
					// document.getElementById("tabBable").className = "";
					// document.getElementById("tabContent2").className = "";
					// document.getElementById("Personal_info").className = "";
				};
				App.initAjax();
    			ComponentsDateTimePickers.init(); // init todo page
		    },50);

		    scope.checkDataNull = function(name){
		    	scope.parseObj(scope.updatedata,name,scope.info);
		    };

		    scope.stringCut = function(string, begin, end) {
				return string.substr(begin,end);
			};

		    scope.getIndex = function(string, charset) {
				return string.indexOf(charset);
			};

		    scope.parseObj = function(obj, charset, value) {
				var array = scope.ParsePropertyName(charset);
				var flag ="";
				obj = scope.addProperty(array,obj,flag, value);
				return obj;
				
			};

			//func parse string A.B.C to array ['A','B','C']
			scope.ParsePropertyName = function(charset) {
				var arrayBuild = [];
				while(1){
					var index = scope.getIndex(charset,".");
					var prop = index!=-1?scope.stringCut(charset,0,index):charset;
					charset = scope.stringCut(charset,index+1,charset.length);
					arrayBuild.push(prop);
					if(index == -1){
						break;
					}
				}
				return arrayBuild;
			};
			//end func

			//func convert array ['A','B','C'] to object A{B{C{}}}
			scope.addProperty = function(array, objectmerge, flag, value) {
				while(1) {
					if(array.length > 0){
						if(typeof objectmerge =='object'){
							if(objectmerge.hasOwnProperty(array[0])==true){
								if(array.length == 1) {
									objectmerge[array[0]] = {};
									// objectmerge[array[0]] == value[array[0]]!=null&&value[array[0]]!=""?value[array[0]]:null;
									if(value[array[0]] == null || value[array[0]] == "")
										delete objectmerge[array[0]];
									else
										objectmerge[array[0]] = value[array[0]];
									array.splice(0,1);
									scope.addProperty(array,objectmerge[key], flag, value[key]);
								}
								else {
									var key = array[0];
									flag = array[0];
									array.splice(0,1);
									scope.addProperty(array,objectmerge[key], flag, value[key]);
								}
							}
							else{
								objectmerge[array[0]] = {};
								if(array.length == 1){
									if(value.length == 0){
										objectmerge[array[0]] = null;
									}
									else{
										objectmerge[array[0]] = value[array[0]];
									}
								}
								flag = array[0];
								array.splice(0,1);
								scope.addProperty(array,objectmerge[flag], flag, value[flag]);
							}
						}
						else {
							break;
						}	
					}
					else {
						break;
					}
				}
				return objectmerge;
			};
			//end func

		    scope.changeEnable = function(Enable) {
		    	scope.info.EnableUser = Enable;
		    	console.log(Enable);
		    };

		    scope.savechange = function(){
		    	if(_.isEmpty(scope.style) == false) {
		    		toastr.error('Please check information','Error');
		    	}
		    	else {
			    	scope.updatedata.ID            = scope.info.ID;
			    	scope.updatedata.Title         = scope.info.Title;
			    	scope.updatedata.Gender        = scope.info.Gender;
			    	scope.updatedata.FirstName     = scope.info.FirstName;
			    	scope.updatedata.LastName      = scope.info.LastName;
			    	scope.updatedata.DOB           = scope.info.DOB;
			    	scope.updatedata.Address1      = scope.info.Address1;
			    	scope.updatedata.Suburb        = scope.info.Suburb;
			    	scope.updatedata.Postcode      = scope.info.Postcode;
			    	scope.updatedata.Occupation    = scope.info.Occupation;
			    	scope.updatedata.State         = scope.info.State;
			    	scope.updatedata.CountryID1    = scope.info.CountryID1;
			    	scope.updatedata.UserAccountID = scope.info.UserAccountID;
					scope.updatedata.UID           = scope.info.UID;
			    	console.log(scope.updatedata);
			    	if(scope.info.PatientKin != null && scope.info.PatientKin != '') scope.updatedata.PatientKin = scope.info.PatientKin;
			    	if(scope.info.PatientGP != null && scope.info.PatientGP != '') scope.updatedata.PatientGP = scope.info.PatientGP;
			    	if(scope.info.PatientFund != null && scope.info.PatientFund != '') scope.updatedata.PatientFund = scope.info.PatientFund;
			    	if(scope.info.PatientPension != null && scope.info.PatientPension != '') scope.updatedata.PatientPension = scope.info.PatientPension;
			    	if(scope.info.PatientDVA != null && scope.info.PatientDVA != '') scope.updatedata.PatientDVA = scope.info.PatientDVA;
			    	if(scope.info.PatientMedicare != null && scope.info.PatientMedicare != '') scope.updatedata.PatientMedicare = scope.info.PatientMedicare;

					PatientService.validate(scope.updatedata)
						.then(function(result){
							scope.er ='';
							scope.ermsg ='';
							scope.updatedata.RoleId = scope.info.UserAccount.RelUserRoles.length!=0?null:3;
							scope.updatedata.timezone = new Date().toString().match(/([\+-][0-9]+)/)[1];
							PatientService.updatePatient(scope.updatedata).then(function(response){
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
								   		scope.uploader.queue[i].headers.userUID = scope.info.UserAccount.UID;
								   		scope.uploader.queue[i].headers.fileType = scope.uploader.queue[i].formData[0].fileType;
								   	}
								   	PatientService.changeStatusFile(postData)
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
								// scope.uploader.queue[0].formData[0].userUID = scope.info.UserAccount.UID;
								// scope.uploader.uploadAll();
								toastr.success("update success!!!","SUCCESS");
								// scope.chooseItem = false;
								// scope.init();
								// console.log(scope.typeShow);
								console.log(scope.typeShow);
								if(scope.typeShow)
									scope.callData(scope.typeShow,true,true);
								else {
									scope.chooseItem = false;
									scope.init();
								}
								// scope.onCancel();
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
				}
			},

			scope.typeFile;
			scope.setType = function(value){
				scope.typeFile=value;
				if(value=="ProfileImage"){
					var imageAvatar = document.getElementById('imageAvatar');
					    imageAvatar.addEventListener('change', function(e){
					    	var canvas = document.getElementById('imageAvatarCanvas');
							var ctx = canvas.getContext('2d');
							var blank = document.createElement('canvas');
	                        blank.width = canvas.width;
	                        blank.height = canvas.height;
	                        if(canvas.toDataURL() == blank.toDataURL()) {
	                            scope.buildImg(imageAvatar, canvas, ctx, e, 350, 350);
	                        }
	                        else {
	                            ctx.clearRect(0, 0, 350, 350);
	                            scope.buildImg(imageAvatar, canvas, ctx, e, 350, 350);
	                        }
							// scope.buildImg(imageAvatar, canvas, ctx,e,350,350);
					    }, false);
					
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
					$('#imageAvatar').val('');
					$('#imageAvatarCanvas').val('');
					scope.isChoseAvatar = false;
				}
			}

			

			AuthenticationService.getListCountry().then(function(result){
				scope.countries = result.data;
			},function(err){
				toastr.error("error data country","ERROR");
			});

			scope.Add = function(model, data) {
					var Url = 'AddModal';
					var modalInstance = $uibModal.open({
						templateUrl: Url,
						scope:scope,
						controller: function($scope,$modalInstance){
							$scope.insertData = {};
							$scope.style = {};
							console.log(scope);
							$scope.typeShow = model;
							$scope.name = model=='PatientKin'?
								'Kin':model=='PatientGP'?
								'GP':model=='PatientMedicare'?
								'Medicare':model=='PatientPension'?
								'Pension':model=='PatientDVA'?
								'DVA':model=='PatientDVA'?
								'DVA':model=='PatientFund'?
								'Fund':null;
							$scope.cancel = function(){
								$modalInstance.dismiss('cancel');
							};
							$scope.loadagain = function() {
								scope.init();
							};
							$scope.checkDataNull = function(name){
						    	scope.parseObj(scope.updatedata,name,$scope.insertData);
						    };
							$scope.Save = function(model, data) {
								console.log(model,' ',data);
								if(_.isEmpty(scope.style) == false) {
									toastr.error('Please check information','Error');
								}
								else{
									if(model == null || model == ''){
										toastr.error("Please choose tab","error");
									} 
									else{
										console.log(data);
										data[model] = $scope.insertData[model];
										data[model].PatientID = scope.info.ID;
										data[model].Enable    = 'Y';
										// data[model].PatientID = scope.info.ID;
										// data[model].Enable = 'Y';
										if(data[model].ExpiryDate) {
											var parts = data[model].ExpiryDate.split('/');
					                        var date = parts[2].toString()+'-'+(parts[1]).toString()+'-'+parts[0].toString()+' +0700';
					                        data[model].ExpiryDate = moment(date).toDate();
										}
										PatientService.addChild({model:model,data:data[model]})
										.then(function(response){
											console.log(response);
											toastr.success("update success!!!","SUCCESS");
											scope.chooseItem = false;
											scope.changeoption = true;
											// scope.onCancel();
											// scope.init();
											$modalInstance.dismiss('cancel');
											scope.callData(model,true);
										},function(err) {
											console.log(err);
											toastr.error("Please check data again.","ERROR");
										});
									}
								}
							};

							$scope.validateChild = function( model, attr, regexChar, message, required) {
								if($scope.insertData[model]) {
									if($scope.insertData[model][attr]) {
										if(required) {
											//if input must be required
										}
										else {
											var regexchar = new RegExp(regexChar);
											console.log(regexchar);
											console.log($scope.insertData[model][attr]);
											console.log(regexchar.test($scope.insertData[model][attr]));
											if(regexchar.test($scope.insertData[model][attr]) == false) {
												$scope.style[attr] = {};
												$scope.style[attr].css = {'border': '2px solid #DCA7B0'};
												if(!message)
													$scope.style[attr].message = attr + ' Invalid';
												else
													$scope.style[attr].message = message;
											}
											else {
												delete $scope.style[attr];
											}
										}
									}
									else {
										delete $scope.style[attr];
									}
								}
							};
						},
						size: 'lg',
						windowClass: model=='Staff'?'app-modal-window':null
					});
			};

			scope.DisableChild = function(model, data) {
				console.log(data);
				// var parseData = JSON.parse(data);
				if(data == null || data == ''){
					toastr.error("Please input information","error");
				} 
				else{
					var postData = {
						ID     : data,
						Enable :'N'
					};
					PatientService.changeStatusChild({model:model,data:postData})
					.then(function(response){
						console.log(response);
						toastr.success("success!!!","SUCCESS");
						scope.chooseItem = false;
						// scope.onCancel();
						scope.init();
					},function(err) {
						console.log(err);
						toastr.error("Please check data again.","ERROR");
					});
				}
			}

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

			scope.MarialList = [
				{'id':'Married','name':"Married"},
				{'id':'Never Married','name':"Never Married"},
				{'id':'Widowed','name':"Widowed"},
				{'id':'Divorced','name':"Divorced"},
				{'id':'Separated','name':"Separated"}
			];
			// scope.MarialList = ['a','b','c'];

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